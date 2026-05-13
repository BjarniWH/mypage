import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  ngOnInit(): void {
    this.animateForm();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactForm.reset();
    }
  }

  private animateForm(): void {
    gsap.fromTo(
      '.contact-form-wrapper',
      { opacity: 0, x: -30 },
      {
        duration: 0.8,
        opacity: 1,
        x: 0,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    );

    // Info cards have CSS hover transform: translateY(-6px) — opacity only.
    gsap.fromTo(
      '.info-card',
      { opacity: 0 },
      { duration: 0.8, opacity: 1, stagger: 0.15, ease: 'power2.out' }
    );
  }
}
