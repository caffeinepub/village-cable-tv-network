import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    q: "How do I reset my cable box?",
    a: "Unplug the power cable from your cable box, wait 30 seconds, then plug it back in. The box will restart and reconnect within 2-3 minutes.",
  },
  {
    q: "What should I do if my internet is slow?",
    a: "First, try restarting your router. If the issue persists, run a speed test and contact our support team with the results.",
  },
  {
    q: "How can I add more channels to my package?",
    a: "Log in to the Subscriber Portal to upgrade your plan, or call us at +1 (555) 234-5678.",
  },
  {
    q: "Can I pause my subscription temporarily?",
    a: "Yes! You can pause your subscription for up to 3 months. Contact our support team or visit us at the office.",
  },
  {
    q: "Is there a contract or minimum period?",
    a: "No long-term contracts. All our plans are month-to-month and can be cancelled at any time.",
  },
];

export function Support() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-10 h-10 mx-auto mb-3 text-blue-300" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Support Center
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            We're here to help. Reach out through any channel below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {[
            {
              icon: Phone,
              label: "Call Us",
              value: "+1 (555) 234-5678",
              sub: "Mon–Sat, 8am–6pm",
            },
            {
              icon: Mail,
              label: "Email Us",
              value: "support@villagecable.net",
              sub: "Reply within 24h",
            },
            {
              icon: MapPin,
              label: "Visit Us",
              value: "12 Main Street",
              sub: "Village Center",
            },
            {
              icon: Clock,
              label: "Emergency Line",
              value: "+1 (555) 999-0000",
              sub: "24/7 for outages",
            },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="text-center rounded-xl shadow-card border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <c.icon className="w-5 h-5 text-accent-blue" />
                  </div>
                  <p className="font-bold text-navy text-sm mb-0.5">
                    {c.label}
                  </p>
                  <p className="text-gray-700 text-sm font-medium">{c.value}</p>
                  <p className="text-gray-400 text-xs">{c.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-accent-blue" /> Send Us a
              Message
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="support.contact_form"
            >
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Smith"
                  required
                  className="mt-1"
                  data-ocid="support.name.input"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                  required
                  className="mt-1"
                  data-ocid="support.email.input"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Describe your issue..."
                  rows={5}
                  required
                  className="mt-1"
                  data-ocid="support.message.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
                data-ocid="support.submit_button"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  data-ocid={`support.faq.item.${i + 1}`}
                >
                  <Card className="rounded-xl border border-border shadow-xs">
                    <CardContent className="p-4">
                      <p className="font-semibold text-navy text-sm mb-1">
                        {faq.q}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
