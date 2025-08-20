export class Environment {
  static useHttps: boolean = true; // Set to false for HTTP to avoid SSL issues
  static httpBaseUrl: string = 'http://localhost:7230/api';
  static httpsBaseUrl: string = 'https://localhost:7230/api';
  static httpBaseImageUrl: string = 'http://localhost:7230/';
  static httpsBaseImageUrl: string = 'https://localhost:7230/';

  static googleMapsApiKey: string = 'AIzaSyCIxRhuQT2XCwuNH9cpBMtUq8a5kbzc9LE'

static stripePublicKey: string = 'pk_test_51Rwn7uC7LrcL50Sgy3jemleKmNPuMT7apQf5W4V335OJq6rn6LqSAViIgfKzgWhgnN5RC6ZrLQs76giC3ld4F45X00GrWPHc3A'; 
  static get baseUrl(): string {
    return this.useHttps ? this.httpsBaseUrl : this.httpBaseUrl;
  }
  static get baseImageUrl(): string {
    return this.useHttps ? this.httpsBaseImageUrl : this.httpBaseImageUrl;
  }

  static isDevelopment: boolean = true;
  static bypassSSLVerification: boolean = true; // Only for development
}
