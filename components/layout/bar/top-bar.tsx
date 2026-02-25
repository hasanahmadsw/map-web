import { Phone, Mail } from 'lucide-react';

function TopBar() {
  const phoneNumbers = [
    { number: '0545444499', href: 'tel:+971545444499' },
    { number: '(+971) 44107001', href: 'tel:+97144107001' },
  ];
  const email = 'info@maproduction.ae';

  return (
    <section className="h-top-bar-height border-border/50 bg-card/95 absolute inset-x-0 z-50 hidden border-b py-2.5 backdrop-blur-sm sm:block">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-4">
            {/* Phone Numbers */}
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-4 w-4" />
              <div className="flex items-center gap-3">
                {phoneNumbers.map((phone, index) => (
                  <a
                    key={index}
                    href={phone.href}
                    className="text-foreground/90 hover:text-foreground font-medium transition-colors duration-200"
                  >
                    {phone.number}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="bg-border h-4 w-px" />

            {/* Email */}
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <a
                href={`mailto:${email}`}
                className="text-foreground/90 hover:text-foreground font-medium transition-colors duration-200"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopBar;
