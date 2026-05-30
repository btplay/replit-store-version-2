import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Availability, Contact, ContactInput, Enquiry, EnquiryInput, HealthStatus, NewsletterInput, NewsletterSubscriber, Package, Testimonial } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPackagesUrl: () => string;
/**
 * @summary List all packages
 */
export declare const listPackages: (options?: RequestInit) => Promise<Package[]>;
export declare const getListPackagesQueryKey: () => readonly ["/api/packages"];
export declare const getListPackagesQueryOptions: <TData = Awaited<ReturnType<typeof listPackages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPackagesQueryResult = NonNullable<Awaited<ReturnType<typeof listPackages>>>;
export type ListPackagesQueryError = ErrorType<unknown>;
/**
 * @summary List all packages
 */
export declare function useListPackages<TData = Awaited<ReturnType<typeof listPackages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPackageUrl: (id: number) => string;
/**
 * @summary Get a package by ID
 */
export declare const getPackage: (id: number, options?: RequestInit) => Promise<Package>;
export declare const getGetPackageQueryKey: (id: number) => readonly [`/api/packages/${number}`];
export declare const getGetPackageQueryOptions: <TData = Awaited<ReturnType<typeof getPackage>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPackage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPackage>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPackageQueryResult = NonNullable<Awaited<ReturnType<typeof getPackage>>>;
export type GetPackageQueryError = ErrorType<void>;
/**
 * @summary Get a package by ID
 */
export declare function useGetPackage<TData = Awaited<ReturnType<typeof getPackage>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPackage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListTestimonialsUrl: () => string;
/**
 * @summary List customer testimonials
 */
export declare const listTestimonials: (options?: RequestInit) => Promise<Testimonial[]>;
export declare const getListTestimonialsQueryKey: () => readonly ["/api/testimonials"];
export declare const getListTestimonialsQueryOptions: <TData = Awaited<ReturnType<typeof listTestimonials>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTestimonials>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTestimonials>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTestimonialsQueryResult = NonNullable<Awaited<ReturnType<typeof listTestimonials>>>;
export type ListTestimonialsQueryError = ErrorType<unknown>;
/**
 * @summary List customer testimonials
 */
export declare function useListTestimonials<TData = Awaited<ReturnType<typeof listTestimonials>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTestimonials>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateEnquiryUrl: () => string;
/**
 * @summary Submit a booking enquiry
 */
export declare const createEnquiry: (enquiryInput: EnquiryInput, options?: RequestInit) => Promise<Enquiry>;
export declare const getCreateEnquiryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEnquiry>>, TError, {
        data: BodyType<EnquiryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createEnquiry>>, TError, {
    data: BodyType<EnquiryInput>;
}, TContext>;
export type CreateEnquiryMutationResult = NonNullable<Awaited<ReturnType<typeof createEnquiry>>>;
export type CreateEnquiryMutationBody = BodyType<EnquiryInput>;
export type CreateEnquiryMutationError = ErrorType<void>;
/**
* @summary Submit a booking enquiry
*/
export declare const useCreateEnquiry: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEnquiry>>, TError, {
        data: BodyType<EnquiryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createEnquiry>>, TError, {
    data: BodyType<EnquiryInput>;
}, TContext>;
export declare const getCreateContactUrl: () => string;
/**
 * @summary Submit a contact form message
 */
export declare const createContact: (contactInput: ContactInput, options?: RequestInit) => Promise<Contact>;
export declare const getCreateContactMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export type CreateContactMutationResult = NonNullable<Awaited<ReturnType<typeof createContact>>>;
export type CreateContactMutationBody = BodyType<ContactInput>;
export type CreateContactMutationError = ErrorType<void>;
/**
* @summary Submit a contact form message
*/
export declare const useCreateContact: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export declare const getGetAvailabilityUrl: () => string;
/**
 * @summary Get unavailable dates
 */
export declare const getAvailability: (options?: RequestInit) => Promise<Availability>;
export declare const getGetAvailabilityQueryKey: () => readonly ["/api/availability"];
export declare const getGetAvailabilityQueryOptions: <TData = Awaited<ReturnType<typeof getAvailability>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAvailability>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAvailability>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAvailabilityQueryResult = NonNullable<Awaited<ReturnType<typeof getAvailability>>>;
export type GetAvailabilityQueryError = ErrorType<unknown>;
/**
 * @summary Get unavailable dates
 */
export declare function useGetAvailability<TData = Awaited<ReturnType<typeof getAvailability>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAvailability>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubscribeNewsletterUrl: () => string;
/**
 * @summary Subscribe to newsletter
 */
export declare const subscribeNewsletter: (newsletterInput: NewsletterInput, options?: RequestInit) => Promise<NewsletterSubscriber>;
export declare const getSubscribeNewsletterMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof subscribeNewsletter>>, TError, {
        data: BodyType<NewsletterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof subscribeNewsletter>>, TError, {
    data: BodyType<NewsletterInput>;
}, TContext>;
export type SubscribeNewsletterMutationResult = NonNullable<Awaited<ReturnType<typeof subscribeNewsletter>>>;
export type SubscribeNewsletterMutationBody = BodyType<NewsletterInput>;
export type SubscribeNewsletterMutationError = ErrorType<void>;
/**
* @summary Subscribe to newsletter
*/
export declare const useSubscribeNewsletter: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof subscribeNewsletter>>, TError, {
        data: BodyType<NewsletterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof subscribeNewsletter>>, TError, {
    data: BodyType<NewsletterInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map