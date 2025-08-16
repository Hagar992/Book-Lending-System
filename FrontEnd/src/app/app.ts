import { Component, signal } from '@angular/core';  
import { RouterOutlet } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { RouterModule } from '@angular/router';
import { Header } from "./shared/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Header, Footer], // ✅ حذف HttpClientModule
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('book-lending-system-angular17');
}
