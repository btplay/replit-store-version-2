import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEnquiry } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Mail, MapPin, Truck, AlertCircle } from "lucide-react";
import { AvailabilityCalendar } from "@/components/availability-calendar";

// Hertfordshire postcodes — free delivery
const HERTS_FREE = ["AL", "HP", "SG", "WD"];
// Adjacent areas — £15 surcharge
const NEARBY_CHARGE: string[] = ["EN", "LU", "MK", "CM", "CB", "HA", "UB", "IG", "RM", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "NN"];

function calcDeliveryCharge(postcode: string): { charge: number; label: string; color: string } {
  if (!postcode || postcode.trim().length < 2) return { charge: 0, label: "", color: "" };
  const upper = postcode.trim().toUpperCase().replace(/\s+/g, "");
  const prefix2 = upper.slice(0, 2);
  const prefix3 = upper.slice(0, 3);

  if (HERTS_FREE.some(p => upper.startsWith(p))) {
    return { charge: 0, label: "Free delivery within Hertfordshire", color: "text-emerald-600" };
  }
  if (NEARBY_CHARGE.some(p => prefix2 === p || prefix3 === p)) {
    return { charge: 15, label: "+£15 delivery charge (just outside Hertfordshire)", color: "text-amber-600" };
  }
  // Everything else assumed 20+ miles
  return { charge: 50, label: "+£50 delivery charge (20+ miles from Hertfordshire)", color: "text-red-500" };
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  venue: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  childAgeRange: z.string().optional(),
  packageInterest: z.string().min(1, "Please select a package"),
  guestCount: z.coerce.number().optional(),
  deliveryCharge: z.coerce.number().optional(),
  additionalDetails: z.string().optional(),
});

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [venueInput, setVenueInput] = useState("");
  const delivery = calcDeliveryCharge(venueInput);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", phone: "", eventDate: "", eventTime: "",
      venue: "", eventType: "", childAgeRange: "", packageInterest: "",
      guestCount: undefined, deliveryCharge: undefined, additionalDetails: "",
    },
  });

  const createEnquiry = useCreateEnquiry();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEnquiry.mutate(
      { data: { ...values, deliveryCharge: delivery.charge || undefined } },
      { onSuccess: () => { setIsSuccess(true); window.scrollTo({ top: 0, behavior: "smooth" }); } }
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-50 px-6 py-24">
        <div className="bg-white p-12 max-w-lg w-full text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#B5C2B7]">
            <CheckCircle2 className="w-8 h-8 text-[#B5C2B7]" />
          </div>
          <h2 className="text-3xl font-serif text-slate-900 mb-4">Enquiry Received</h2>
          <p className="text-slate-600 font-light mb-8 leading-relaxed">
            Thank you for getting in touch with BT Play. We'll review your requirements and get back to you within 24–48 hours with availability and a quote.
          </p>
          <Button onClick={() => (window.location.href = "/")} className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white tracking-widest uppercase text-xs h-12 px-8 border-none">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Book Now</h1>
          <p className="text-slate-500 font-light text-lg">Fill in your event details and we'll get back to you within 24–48 hours.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 lg:col-start-1">
          <div className="sticky top-32">
            <h2 className="text-2xl font-serif text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-slate-600 font-light mb-10 leading-relaxed">Tell us about your celebration and we'll confirm availability with a clear, straightforward quote.</p>
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B5C2B7] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-slate-800 mb-1">Email</h4>
                  <a href="mailto:hello@btplay.co.uk" className="text-slate-600 hover:text-[#B5C2B7] transition-colors text-sm">hello@btplay.co.uk</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B5C2B7] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-slate-800 mb-1">Service Area</h4>
                  <p className="text-slate-600 text-sm">Hertfordshire & Surrounding Counties</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-[#B5C2B7] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-slate-800 mb-1">Delivery</h4>
                  <p className="text-slate-600 text-sm">Free within Hertfordshire · +£15 nearby areas · +£50 for 20+ miles</p>
                </div>
              </div>
            </div>
            <div className="mt-10 p-6 bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold tracking-widest uppercase text-slate-800 mb-4">Packages</h4>
              <div className="space-y-4 text-sm text-slate-600 font-light">
                <div className="border-b border-slate-200 pb-3">
                  <p className="font-semibold text-slate-800">Premium — £100</p>
                  <p className="mt-1">Bouncy castle + play pen + ball pit + birthday decor. Up to 10 children, 3 hrs.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Luxury — £180 ✦ Recommended</p>
                  <p className="mt-1">All Premium + extra toys, shapes & mats, up to 20 children, personalised decor. Optional extras available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 bg-white border border-slate-100 shadow-sm p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Full Name *</FormLabel>
                    <FormControl><Input placeholder="Jane Doe" className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Email Address *</FormLabel>
                    <FormControl><Input type="email" placeholder="jane@example.com" className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Phone Number *</FormLabel>
                    <FormControl><Input type="tel" placeholder="07123 456789" className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Event Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-none"><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Birthday">Birthday Party</SelectItem>
                        <SelectItem value="Baby Shower">Baby Shower</SelectItem>
                        <SelectItem value="Corporate">Corporate Event</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Package Selection */}
              <FormField control={form.control} name="packageInterest" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Package *</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: "Premium", label: "Premium", price: "£100", desc: "Up to 10 children · 3 hrs · Birthday decor" },
                      { value: "Luxury", label: "Luxury ✦ Recommended", price: "£180", desc: "Up to 20 children · Personalised decor · Extras available" },
                    ].map(pkg => (
                      <button
                        key={pkg.value}
                        type="button"
                        onClick={() => field.onChange(pkg.value)}
                        className={`text-left p-4 border transition-all ${field.value === pkg.value ? "border-[#B5C2B7] bg-[#B5C2B7]/5" : "border-slate-200 hover:border-[#B5C2B7]/50"}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-slate-800 text-sm">{pkg.label}</span>
                          <span className="font-serif text-[#B5C2B7] text-lg leading-none">{pkg.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{pkg.desc}</p>
                        {field.value === pkg.value && <div className="mt-2 flex items-center gap-1 text-[#B5C2B7] text-xs font-medium"><CheckCircle2 className="w-3 h-3" /> Selected</div>}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Event Date */}
              <FormField control={form.control} name="eventDate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Event Date *</FormLabel>
                  <AvailabilityCalendar selectedDate={field.value} onDateSelect={(date) => field.onChange(date)} />
                  {field.value && (
                    <p className="text-xs text-[#B5C2B7] mt-1">Selected: {new Date(field.value + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              {/* Event Time */}
              <FormField control={form.control} name="eventTime" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Event Start Time *</FormLabel>
                  <FormControl>
                    <Input type="time" className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none text-slate-700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Venue & delivery charge */}
              <FormField control={form.control} name="venue" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Venue / Postcode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. AL1 1AA"
                      className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none"
                      {...field}
                      onChange={(e) => { field.onChange(e); setVenueInput(e.target.value); }}
                    />
                  </FormControl>
                  {delivery.label && (
                    <div className={`flex items-center gap-2 text-xs mt-1 ${delivery.color}`}>
                      {delivery.charge === 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {delivery.label}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="childAgeRange" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Age Range of Children</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-none"><SelectValue placeholder="Select ages" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1">0–1 Years (Babies)</SelectItem>
                        <SelectItem value="1-2">1–2 Years (Toddlers)</SelectItem>
                        <SelectItem value="2-4">2–4 Years (Pre-school)</SelectItem>
                        <SelectItem value="mixed">Mixed (0–4 Years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="guestCount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Est. Number of Children</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 12" className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-none" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="additionalDetails" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium text-xs tracking-wider uppercase">Additional Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us anything else about your event — venue size, access notes, or any questions..." className="min-h-[120px] bg-slate-50 border-transparent focus:bg-white rounded-none resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Summary if delivery charge applies */}
              {delivery.charge > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 rounded-none">
                  <p className="font-medium mb-1">Delivery charge applies</p>
                  <p className="font-light">A <strong>£{delivery.charge}</strong> delivery charge will be added to your quote for your location. We'll confirm this when we get back to you.</p>
                </div>
              )}

              <Button type="submit" className="w-full h-14 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white tracking-widest uppercase text-xs border-none" disabled={createEnquiry.isPending}>
                {createEnquiry.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Book Now"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
