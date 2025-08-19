import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  img: string;
  date: string;
  slug: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export interface ArticleResponse {
  success: boolean;
  message: string;
  data: Article[];
}

export interface SingleArticleResponse {
  success: boolean;
  message: string;
  data: Article;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${Environment.baseUrl}/Articles`;

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/All`);
  }

  getArticleBySlug(slug: string): Observable<SingleArticleResponse> {
    return this.http.get<SingleArticleResponse>(`${this.apiUrl}/BySlug/${slug}`);
  }

  getFeaturedArticles(): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/Featured`);
  }

  searchArticles(query: string): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/Search?query=${encodeURIComponent(query)}`);
  }
} 