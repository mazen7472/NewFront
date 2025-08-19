import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct, ProductSpecification } from '../../Interfaces/iproduct';

@Component({
  selector: 'app-test-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3>Test Comparison Logic</h3>
      
      <div class="row">
        <div class="col-md-6">
          <h4>Product A</h4>
          <pre>{{ JSON.stringify(productA, null, 2) }}</pre>
        </div>
        <div class="col-md-6">
          <h4>Product B</h4>
          <pre>{{ JSON.stringify(productB, null, 2) }}</pre>
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-primary" (click)="testComparison()">Test Comparison</button>
      </div>

      <div class="mt-4" *ngIf="comparisonResults.length > 0">
        <h4>Comparison Results</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Product A</th>
              <th>Product B</th>
              <th>Comparison</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let result of comparisonResults">
              <td>{{ result.key }}</td>
              <td>{{ result.value1 }}</td>
              <td>{{ result.value2 }}</td>
              <td>{{ result.comparison }}</td>
              <td>{{ result.difference }}{{ result.unit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TestComparisonComponent {
  productA: IProduct;
  productB: IProduct;
  comparisonResults: any[] = [];
  JSON = JSON; // Make JSON available in template

  constructor() {
    // Test data with Memory specification
    this.productA = {
      id: '1',
      name: 'Test Product A',
      price: 500,
      discountPrice: 450,
      imageUrl: 'test.jpg',
      imageUrls: ['test.jpg','test.jpg','test.jpg'],
      categoryName: 'Test',
      subCategoryId: '1',
      subCategoryName: 'Test',
      status: 'Approved',
      techCompanyId: '123',
      techCompanyName: 'Tech Company',
      specifications: [
        {
          id: '1',
          key: 'Memory',
          value: '8'
        },
        {
          id: '2',
          key: 'speed MHZ',
          value: '30000'
        },
        {
          id: '3',
          key: 'power consumption',
          value: '250W'
        }
      ]
    };

    this.productB = {
      id: '2',
      name: 'Test Product B',
      price: 600,
      discountPrice: 550,
      imageUrl: 'test2.jpg',
      imageUrls: ['test.jpg','test.jpg','test.jpg'],
      categoryName: 'Test',
      subCategoryId: '1',
      subCategoryName: 'Test',
      status: 'Approved',
      techCompanyId: '123',
      techCompanyName: 'Tech Company',
      specifications: [
        {
          id: '4',
          key: 'Memory',
          value: '16'
        },
        {
          id: '5',
          key: 'speed MHZ',
          value: '28000'
        },
        {
          id: '6',
          key: 'power consumption',
          value: '200W'
        }
      ]
    };
  }

  testComparison() {
    const specs1 = this.productA.specifications || [];
    const specs2 = this.productB.specifications || [];

    // Create a comprehensive comparison by combining all unique specifications
    const allSpecKeys = new Set([
      ...specs1.map(s => s.key),
      ...specs2.map(s => s.key)
    ]);

    this.comparisonResults = Array.from(allSpecKeys).map(specKey => {
      const spec1 = specs1.find(s => s.key === specKey);
      const spec2 = specs2.find(s => s.key === specKey);
      
      if (!spec1 && !spec2) {
        return {
          key: specKey,
          value1: 'N/A',
          value2: 'N/A',
          better: null,
          comparison: 'No data available',
          difference: 'N/A'
        };
      }

      if (!spec1) {
        return {
          key: specKey,
          value1: 'N/A',
          value2: spec2!.value.toString(),
          better: null,
          comparison: `${this.productB.name} only`,
          difference: 'N/A'
        };
      }

      if (!spec2) {
        return {
          key: specKey,
          value1: spec1.value.toString(),
          value2: 'N/A',
          better: null,
          comparison: `${this.productA.name} only`,
          difference: 'N/A'
        };
      }

      const comparison = this.compareSpecificationValues(spec1.key, spec1.value, spec2.value);
      
      return {
        key: spec1.key,
        value1: spec1.value.toString(),
        value2: spec2.value.toString(),
        better: comparison.better,
        comparison: comparison.comparison,
        difference: comparison.difference,
        unit: comparison.unit
      };
    });

    console.log('Test comparison results:', this.comparisonResults);
  }

  private compareSpecificationValues(specKey: string, value1: string, value2: string): {
    better: string | null;
    comparison: string;
    difference: string;
    unit?: string;
  } {
    // Clean and normalize the specification key for better matching
    const normalizedKey = specKey.toLowerCase().trim();
    
    // Extract numeric values, handling different formats
    const num1 = this.extractNumericValue(value1);
    const num2 = this.extractNumericValue(value2);
    
    // If both values are not numbers, do text comparison
    if (num1 === null || num2 === null) {
      if (value1.toLowerCase() === value2.toLowerCase()) {
        return {
          better: null,
          comparison: 'Equal',
          difference: 'Same value'
        };
      } else {
        return {
          better: null,
          comparison: 'Different',
          difference: `${value1} vs ${value2}`
        };
      }
    }

    // Define specification types and their comparison logic
    const specTypes = this.getSpecificationTypes();
    const specType = this.findSpecificationType(normalizedKey, specTypes);
    
    let better: string | null = null;
    let comparison = '';
    let difference = '';
    let unit = this.extractUnit(value1) || this.extractUnit(value2) || '';

    switch (specType) {
      case 'higher_better':
        if (num1 > num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} is better`;
          difference = `+${(num1 - num2).toFixed(2)}`;
        } else if (num1 < num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} is better`;
          difference = `+${(num2 - num1).toFixed(2)}`;
        } else {
          comparison = 'Equal performance';
          difference = '0';
        }
        break;

      case 'lower_better':
        if (num1 < num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} is better`;
          difference = `-${(num2 - num1).toFixed(2)}`;
        } else if (num1 > num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} is better`;
          difference = `-${(num1 - num2).toFixed(2)}`;
        } else {
          comparison = 'Equal performance';
          difference = '0';
        }
        break;

      case 'memory':
        if (num1 > num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} has more memory`;
          difference = `+${(num1 - num2).toFixed(0)}`;
        } else if (num1 < num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} has more memory`;
          difference = `+${(num2 - num1).toFixed(0)}`;
        } else {
          comparison = 'Equal memory';
          difference = '0';
        }
        break;

      case 'speed':
        if (num1 > num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} has higher speed`;
          difference = `+${(num1 - num2).toFixed(0)}`;
        } else if (num1 < num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} has higher speed`;
          difference = `+${(num2 - num1).toFixed(0)}`;
        } else {
          comparison = 'Equal speed';
          difference = '0';
        }
        break;

      case 'power_consumption':
        if (num1 < num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} is more power efficient`;
          difference = `-${(num2 - num1).toFixed(0)}`;
        } else if (num1 > num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} is more power efficient`;
          difference = `-${(num1 - num2).toFixed(0)}`;
        } else {
          comparison = 'Equal power consumption';
          difference = '0';
        }
        break;

      default:
        if (num1 > num2) {
          better = this.productA.name;
          comparison = `${this.productA.name} has higher value`;
          difference = `+${(num1 - num2).toFixed(2)}`;
        } else if (num1 < num2) {
          better = this.productB.name;
          comparison = `${this.productB.name} has higher value`;
          difference = `+${(num2 - num1).toFixed(2)}`;
        } else {
          comparison = 'Equal values';
          difference = '0';
        }
    }

    return { better, comparison, difference, unit };
  }

  private extractNumericValue(value: string): number | null {
    // Remove common units and extract numeric value
    const cleanValue = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleanValue);
    return isNaN(num) ? null : num;
  }

  private extractUnit(value: string): string {
    // Extract unit from value string
    const unitMatch = value.match(/[a-zA-Z%]+/g);
    return unitMatch ? unitMatch.join('') : '';
  }

  private findSpecificationType(key: string, specTypes: { [key: string]: string }): string {
    // Try exact match first
    if (specTypes[key]) {
      return specTypes[key];
    }
    
    // Try partial matches
    for (const [specKey, specType] of Object.entries(specTypes)) {
      if (key.includes(specKey) || specKey.includes(key)) {
        return specType;
      }
    }
    
    // Default to numeric comparison
    return 'numeric';
  }

  private getSpecificationTypes(): { [key: string]: string } {
    return {
      // Higher is better
      'memory': 'memory',
      'ram': 'memory',
      'storage': 'memory',
      'capacity': 'memory',
      'cores': 'higher_better',
      'cuda cores': 'higher_better',
      'stream processors': 'higher_better',
      'core clock': 'clock_speed',
      'boost clock': 'clock_speed',
      'base clock': 'clock_speed',
      'frequency': 'clock_speed',
      'speed': 'speed',
      'speed mhz': 'speed',
      'bandwidth': 'higher_better',
      'memory bandwidth': 'higher_better',
      'cache': 'memory',
      'l3 cache': 'memory',
      'l2 cache': 'memory',
      'threads': 'higher_better',
      'performance': 'higher_better',
      'score': 'higher_better',
      'rating': 'higher_better',
      
      // Lower is better
      'power consumption': 'power_consumption',
      'tdp': 'power_consumption',
      'wattage': 'power_consumption',
      'latency': 'lower_better',
      'response time': 'lower_better',
      'delay': 'lower_better',
      'wait time': 'lower_better',
      
      // Price comparison
      'price': 'price',
      'cost': 'price',
      
      // Text-based specs
      'type': 'text',
      'status': 'text',
      'manufacturer': 'text',
      'brand': 'text',
      'model': 'text',
      'interface': 'text',
      'form factor': 'text',
      'color': 'text',
      'material': 'text'
    };
  }
} 