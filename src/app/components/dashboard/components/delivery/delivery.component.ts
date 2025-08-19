import { Component, OnInit } from '@angular/core';
import { DeliveryPerson, DeliveryPersonService } from '../../../../Services/delivery-person.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliveryPersons: DeliveryPerson[] = [];
  selectedPerson: DeliveryPerson | null = null;
  showModal = false;

  showEditModal = false;
  editPerson: Partial<DeliveryPerson> | null = null;

  constructor(private deliveryService: DeliveryPersonService) {}

  ngOnInit(): void {
    this.loadDeliveryPersons();
  }

  loadDeliveryPersons(): void {
    this.deliveryService.getAllDeliveryPersons().subscribe({
      next: (res) => {
        if (res.success) {
          this.deliveryPersons = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  openDetails(person: DeliveryPerson): void {
    this.selectedPerson = person;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPerson = null;
  }

  openEdit(person: DeliveryPerson): void {
    // Clone only editable fields
    this.editPerson = {
      id: person.id,
      vehicleNumber: person.vehicleNumber,
      vehicleType: person.vehicleType,
      vehicleImage: person.vehicleImage,
      phoneNumber: person.phoneNumber,
      city: person.city,
      country: person.country,
      isAvailable: person.isAvailable,
      accountStatus: person.accountStatus
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editPerson = null;
  }

  saveEdit(): void {
    if (!this.editPerson || !this.editPerson.id) return;

    this.deliveryService.updateDeliveryPerson(this.editPerson.id, this.editPerson).subscribe({
      next: (res) => {
        // Update local list
        console.log(res);
        const index = this.deliveryPersons.findIndex(p => p.id === this.editPerson!.id);
        if (index !== -1) {
          this.deliveryPersons[index] = { ...this.deliveryPersons[index], ...this.editPerson } as DeliveryPerson;
        }
        this.closeEditModal();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
