using System.ComponentModel.DataAnnotations;

namespace btlast.Models
{
    public class ContactFormViewModel : IValidatableObject
    {
        // Ortak Alanlar
        [Required(ErrorMessage = "Ad Soyad alanı zorunludur.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "E-posta alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Telefon alanı zorunludur.")]
        public string? Phone { get; set; }

        [Range(typeof(bool), "true", "true", ErrorMessage = "KVKK onayı zorunludur.")]
        public bool KvkkConsent { get; set; }

        // Form Tipini Belirleme
        [Required]
        public string? FormType { get; set; }

        // Sadece İletişim Formu Alanları
        public string? Subject { get; set; }
        public string? Message { get; set; }

        // Sadece Randevu Formu Alanları
        public string? AppointmentType { get; set; }
        public string? AppointmentDate { get; set; }
        public string? AppointmentTime { get; set; }

        // Koşullu Doğrulama Metodu
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (FormType == "appointment")
            {
                if (string.IsNullOrWhiteSpace(AppointmentType))
                {
                    yield return new ValidationResult("Randevu Türü alanı zorunludur.", new[] { nameof(AppointmentType) });
                }
                if (string.IsNullOrWhiteSpace(AppointmentDate))
                {
                    yield return new ValidationResult("Randevu Tarihi alanı zorunludur.", new[] { nameof(AppointmentDate) });
                }
                if (string.IsNullOrWhiteSpace(AppointmentTime))
                {
                    yield return new ValidationResult("Randevu Saati alanı zorunludur.", new[] { nameof(AppointmentTime) });
                }
            }
        }
    }
}
