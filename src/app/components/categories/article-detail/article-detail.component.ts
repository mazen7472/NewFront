import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Article } from '../../../Interfaces/article';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: Article | undefined;

  private articles: Article[] = [
    {
      title: 'RTX 4090 vs RTX 4080',
      description: 'Gaming benchmarks that reveal next-gen GPU power.',
      content: 'Full content of the RTX 4090 vs 4080 comparison article.',
      img: 'assets/Images/w800.png',
      date: 'Jan 15, 2025',
      slug: 'rtx-4090-vs-4080'
    },
    {
      title: 'AMD Ryzen 7000 Review',
      description: 'How AMD stacks up against Intel’s 13th gen chips.',
      content: 'Detailed analysis and benchmark comparisons of AMD Ryzen 7000 series.',
      img: 'https://www.amd.com/content/dam/amd/en/images/pr-feed/1247269.png',
      date: 'Jan 12, 2025',
      slug: 'ryzen-7000-review'
    },
    {
      title: 'DDR5 vs DDR4',
      description: 'Is upgrading worth it for your setup?',
      content: 'Exploring memory speeds, compatibility, and performance in modern PCs.',
      img: 'assets/Images/ddr5.jpg',
      date: 'Jan 10, 2025',
      slug: 'ddr5-vs-ddr4'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.article = this.articles.find(article => article.slug === slug);
    }
  }
}
