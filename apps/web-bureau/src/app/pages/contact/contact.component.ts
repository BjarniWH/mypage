import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <div class="contact-hero">
        <h1>Get in Touch</h1>
        <p class="subtitle">We'd love to hear about your project</p>
      </div>

      <div class="contact-content">
        <div class="contact-form-wrapper">
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                placeholder="John Doe"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="john@example.com"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input
                type="text"
                id="subject"
                formControlName="subject"
                placeholder="Tell us what it's about"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                formControlName="message"
                placeholder="Your message here..."
                rows="6"
                class="form-textarea"
              ></textarea>
            </div>

            <button type="submit" class="submit-button" [disabled]="!contactForm.valid">
              Send Message
            </button>
          </form>
        </div>

        <div class="contact-info">
          <div class="info-card">
            <div class="info-icon">📍</div>
            <h3>Location</h3>
            <p>Your City, Country</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📧</div>
            <h3>Email</h3>
            <p>hello@ourburo.com</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📱</div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.animateForm();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      console.log(this.contactForm.value);
      // Reset form after submission
      setTimeout(() => {
        this.contactForm.reset();
        this.submitted = false;
      }, 2000);
    }
  }

  private animateForm() {
    gsap.from('.contact-form-wrapper', {
      duration: 0.8,
      opacity: 0,
      x: -30,
      ease: 'power2.out'
    });

    gsap.from('.info-card', {
      duration: 0.8,
      opacity: 0,
      x: 30,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }
}
