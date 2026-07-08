import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CONTACT_EMAIL, IS_CONTACT_FORM_CONFIGURED } from '../../config/contact-form.config';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.component.html'
})
export class ContactPageComponent implements AfterViewInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('nameInput') private readonly nameInput?: ElementRef<HTMLInputElement>;

  readonly contactEmail = CONTACT_EMAIL;
  readonly isContactFormConfigured = IS_CONTACT_FORM_CONFIGURED;
  readonly whatsappLabel = '+54 9 3517 69-6363';
  readonly whatsappUrl = 'https://wa.me/5493517696363';
  isSending = false;
  successMessage = '';
  errorMessage = '';

  readonly contactForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngAfterViewInit(): void {
    if (this.route.snapshot.fragment !== 'contact-form') {
      return;
    }

    setTimeout(() => {
      this.nameInput?.nativeElement.focus();
    });
  }

  submitForm(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!this.isContactFormConfigured) {
      this.errorMessage = `El formulario todavía no está configurado. Escribí directamente a ${this.contactEmail}.`;
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
