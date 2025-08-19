import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';

interface Article {
  title: string;
  description: string;
  img: string;
  date: string;
  slug: string;
}

interface Category {
  title: string;
  description: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink], 
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  searchQuery = '';
  showSubscription = true;

  featuredArticles: Article[] = [
    {
      title: 'RTX 4090 vs RTX 4080',
      description: 'Gaming benchmarks that reveal next-gen GPU power.',
      img: 'assets/Images/w800.png',
      date: 'Jan 15, 2025',
      slug: 'rtx-4090-vs-4080'
    },
    {
      title: 'AMD Ryzen 7000 Review',
      description: 'How AMD stacks up against Intel’s 13th gen chips.',
      img: 'https://www.amd.com/content/dam/amd/en/images/pr-feed/1247269.png',
      date: 'Jan 12, 2025',
      slug: 'ryzen-7000-review'
    },
    {
      title: 'DDR5 vs DDR4',
      description: 'Is upgrading worth it for your setup?',
      img: 'assets/Images/ddr5.jpg',
      date: 'Jan 10, 2025',
      slug: 'ddr5-vs-ddr4'
    }
  ];

 categories = [
    { label: 'SERVICES', imageUrl: '../../../../../assets/Images/Categories/customer-service-1.png' },
    { label: 'Processors ', imageUrl: '../../../../../assets/Images/Categories/processors.png' },
    { label: 'Mother Boards', imageUrl: '../../../../../assets/Images/Categories/motherboard.png' },
    { label: 'Graphics Cards', imageUrl: '../../../../../assets/Images/Categories/video-card.png' },
    { label: 'LapTop', imageUrl: '../../../../../assets/Images/Categories/laptop.png' },
    { label: 'Ram', imageUrl: '../../../../../assets/Images/Categories/ram.png' }
  ];

  tags: string[] = ['GPU', 'Budget', 'Maintenance', 'Build Guide', 'Performance'];

  get filteredArticles() {
    return this.featuredArticles.filter(article =>
      article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  trackByTitle(index: number, item: { title: string }) {
    return item.title;
  }
}
