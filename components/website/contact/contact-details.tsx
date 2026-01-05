import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { SocialIcons } from '@/components/shared/social-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsService } from '@/services/settings.service';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';

async function ContactDetails() {
  const { data: settings } = await settingsService.getSettings();

  return (
    <MotionWrapper
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="lg:col-span-1"
    >
      <Card className="bg-primary border-none shadow-2xl backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Get In Touch</CardTitle>
          <CardDescription className="text-muted/80">
            Contact us for any questions or inquiries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <MotionWrapper whileHover={{ scale: 1.04 }} className="flex items-start space-x-4">
            <div className="rounded-full bg-white/20 p-3 shadow-md">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Email</h3>
              <p className="text-muted/80">{settings?.contact?.email || 'N/A'}</p>
            </div>
          </MotionWrapper>

          <MotionWrapper whileHover={{ scale: 1.04 }} className="flex items-start space-x-4">
            <div className="rounded-full bg-white/20 p-3 shadow-md">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Phone</h3>
              <p className="text-muted/80">{settings?.contact?.phone || 'N/A'}</p>
            </div>
          </MotionWrapper>

          {/* <MotionWrapper whileHover={{ scale: 1.04 }} className="flex items-start space-x-4">
            <div className="rounded-full bg-white/20 p-3 shadow-md">
              <SocialIcons.whatsapp className="h-6 w-6 fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Whatsapp</h3>
              <p className="text-muted/80">{settings?.contact?.whatsapp || "N/A"}</p>
            </div>
          </MotionWrapper> */}

          <MotionWrapper whileHover={{ scale: 1.04 }} className="flex items-start space-x-4">
            <div className="rounded-full bg-white/20 p-3 shadow-md">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Address</h3>
              <p className="text-muted/80">{settings?.contact?.address || 'N/A'}</p>
            </div>
          </MotionWrapper>

          <MotionWrapper whileHover={{ scale: 1.04 }} className="flex items-start space-x-4">
            <div className="rounded-full bg-white/20 p-3 shadow-md">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Hours</h3>
              <p className="text-muted/80">{settings?.contact?.workingHours || 'N/A'}</p>
            </div>
          </MotionWrapper>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}

export default ContactDetails;
