import { Component } from '@angular/core';

@Component({
  selector: 'app-home-prands',
  standalone: true,
  imports: [],
  templateUrl: './home-prands.component.html',
  styleUrl: './home-prands.component.css'
})
export class HomePrandsComponent {
  paused = false;
  brands = [
    { name: 'ASUS', imageUrl: 'https://i.postimg.cc/pXd1rYVw/asus-1.png' },
    { name: 'MSI', imageUrl: 'https://i.postimg.cc/7Z4v6Jc0/MSI-Logo-1.png' },
    { name: 'Gigabyte', imageUrl: 'https://i.postimg.cc/NMHbmp2M/gigabyte.png' },
    { name: 'NVIDIA', imageUrl: 'https://i.postimg.cc/d34Ycssg/nvidia-3.png' },
    { name: 'AMD', imageUrl: 'https://i.postimg.cc/XJtjD7vL/amd.png' },
    { name: 'Intel', imageUrl: 'https://i.postimg.cc/HLB1FW65/intel.png' },
    { name: 'Cooler Master', imageUrl: 'https://i.postimg.cc/wjjCLYqj/cooler-master-logo-black-and-white-1.png' },
    { name: 'hp', imageUrl: 'https://i.postimg.cc/cCcztXP3/hp.png' },
    { name: 'Dell', imageUrl: 'https://i.postimg.cc/5NnGxKBd/dell.png' },
    { name: 'Samsung', imageUrl: 'https://i.postimg.cc/d1grFy6T/samsung.png' },
    { name: 'Logitech', imageUrl: 'https://i.postimg.cc/FzmF0FsB/logitech.png' },
   
    
  ];
}
