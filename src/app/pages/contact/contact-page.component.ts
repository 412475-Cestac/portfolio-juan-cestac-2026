import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { CONTACT_EMAIL } from '../../config/contact-form.config';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.component.html'
})
export class ContactPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);

  readonly contactEmail = CONTACT_EMAIL;
  isSending = false;
  successMessage = '';
  errorMessage = '';

  readonly contactForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submitForm(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.contactForm.disable();

    this.contactService.sendContactMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Mensaje enviado correctamente. Gracias por escribir.';
        this.contactForm.reset();
        this.contactForm.enable();
        this.isSending = false;
      },
      error: () => {
        this.errorMessage = `No se pudo enviar el mensaje. Probá nuevamente o escribí directamente a ${this.contactEmail}.`;
        this.contactForm.enable();
        this.isSending = false;
      }
    });
  }

  hasError(controlName: 'name' | 'email' | 'projectType' | 'message', errorName: string): boolean {
    const control = this.contactForm.controls[controlName];

    return control.hasError(errorName) && (control.touched || control.dirty);
  }
}
