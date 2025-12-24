'use client';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Phone, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { contactSchema, TContactSchemaForm } from '@/validations/contact.schema';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { LoadingButton } from '@/components/shared/buttons/loading-button';

function ContactForm() {
  // const { submitContact, isPending, error } = useContact();

  const form = useForm({
    resolver: zodResolver(contactSchema()),
  });

  const onSubmit = async (data: TContactSchemaForm) => {
    try {
      // await submitContact(data);

      toast.success('Message sent successfully');
    } catch (error) {
      const errMsg = (error as Error)?.message || 'Failed to send message';
      toast.error(errMsg);

      console.error('Error submit contact:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="lg:col-span-2"
    >
      <Card className="bg-card/90 border-none shadow-2xl backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-primary text-3xl font-extrabold tracking-tight">
            Send Us Message Form
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Contact us for any questions or inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <TextInput
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  autoFocus
                />
                <TextInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <TextInput
                  control={form.control}
                  name="subject"
                  label="Subject"
                  placeholder="Enter your subject"
                  autoFocus
                />
                <NumericInput
                  control={form.control}
                  name="phone"
                  label="Phone"
                  placeholder="01234567890"
                  icon={<Phone className="text-muted-foreground h-5 w-5" />}
                  isPhoneNumber
                />
              </div>

              <TextAreaInput
                control={form.control}
                name="msg"
                label="Message"
                placeholder="Enter your message"
              />

              {/* Response Error */}
              {/* <ResponseError error={error} /> */}

              <motion.div
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <LoadingButton
                  isLoading={false}
                  loadingText="Submitting..."
                  defaultText="Submit"
                  icon={Send}
                  className="from-primary to-primary/90 shadow-primary/25 hover:shadow-3xl hover:shadow-primary/40 w-full min-w-40 bg-gradient-to-r py-2.5 font-bold shadow-lg transition-all"
                />
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ContactForm;
