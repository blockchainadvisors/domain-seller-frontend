"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyDomain } from "@/services/domains/my-domains-provider";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { toast } from "react-toastify";

// A reusable component for contact sections
const ContactSection = ({
  title,
  contactData,
  setContactData,
  handleSubmit,
  fieldPath = {},
}: {
  title: string;
  contactData: Record<string, any>;
  setContactData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleSubmit: any;
  fieldPath?: Record<string, string>; // Maps input names to nested paths
}) => {
  const getNestedValue = (path: string): string => {
    return path.split(".").reduce((acc, key) => acc?.[key] ?? "", contactData) as unknown as string;
  };

  const setNestedValue = (path: string, value: string) => {
    setContactData((prev) => {
      const keys = path.split(".");
      const lastKey = keys.pop();

      const newData = { ...prev };
      let nestedObj = newData;

      keys.forEach((key) => {
        if (!nestedObj[key]) nestedObj[key] = {};
        nestedObj = nestedObj[key];
      });

      if (lastKey) nestedObj[lastKey] = value;
      return newData;
    });
  };

  return (
    <div className="border rounded-md flex flex-col gap-5 p-3">
      <h6 className="font-bold">{title}</h6>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-5">
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Firstname</label>
            <Input
              placeholder="Firstname"
              value={getNestedValue(fieldPath.nameFirst || "nameFirst")}
              onChange={(e) =>
                setNestedValue(fieldPath.nameFirst || "nameFirst", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Lastname</label>
            <Input
              placeholder="Lastname"
              value={getNestedValue(fieldPath.nameLast || "nameLast")}
              onChange={(e) =>
                setNestedValue(fieldPath.nameLast || "nameLast", e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Email</label>
          <Input
            placeholder="Email"
            value={getNestedValue(fieldPath.email || "email")}
            onChange={(e) =>
              setNestedValue(fieldPath.email || "email", e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Phone</label>
          <Input
            placeholder="Phone"
            value={getNestedValue(fieldPath.phone || "phone")}
            onChange={(e) =>
              setNestedValue(fieldPath.phone || "phone", e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Fax</label>
          <Input
            placeholder="Fax"
            value={getNestedValue(fieldPath.fax || "fax")}
            onChange={(e) =>
              setNestedValue(fieldPath.fax || "fax", e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Address 1</label>
            <Input
              placeholder="Address 1"
              value={getNestedValue(fieldPath.address1 || "addressMailing.address1")}
              onChange={(e) =>
                setNestedValue(fieldPath.address1 || "addressMailing.address1", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Address 2</label>
            <Input
              placeholder="Address 2"
              value={getNestedValue(fieldPath.address2 || "addressMailing.address2")}
              onChange={(e) =>
                setNestedValue(fieldPath.address2 || "addressMailing.address2", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">City</label>
            <Input
              placeholder="City"
              value={getNestedValue(fieldPath.city || "addressMailing.city")}
              onChange={(e) =>
                setNestedValue(fieldPath.city || "addressMailing.city", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Country</label>
            <Input
              placeholder="Country"
              value={getNestedValue(fieldPath.country || "addressMailing.country")}
              onChange={(e) =>
                setNestedValue(fieldPath.country || "addressMailing.country", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">ZIP Code</label>
            <Input
              placeholder="ZIP Code"
              value={getNestedValue(fieldPath.postalCode || "addressMailing.postalCode")}
              onChange={(e) =>
                setNestedValue(fieldPath.postalCode || "addressMailing.postalCode", e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">State</label>
            <Input
              placeholder="State"
              value={getNestedValue(fieldPath.state || "addressMailing.state")}
              onChange={(e) =>
                setNestedValue(fieldPath.state || "addressMailing.state", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <Button className="self-end" onClick={handleSubmit}>Save</Button>
    </div>
  );
};


export default function ContactInfo() {
  const fetch = useFetch();
  const { domain } = useMyDomain();

  const [adminContact, setAdminContact] = useState<Record<string, any>>({});
  const [billingContact, setBillingContact] = useState<Record<string, any>>({});
  const [registrantContact, setRegistrantContact] = useState<Record<string, any>>({});
  const [techContact, setTechContact] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!domain) return;

    setAdminContact(domain.contactAdmin || {});
    setBillingContact(domain.contactBilling || {});
    setRegistrantContact(domain.contactRegistrant || {});
    setTechContact(domain.contactTech || {});
  }, [domain]);

  const handleSubmit = async () => {
    const requestUrl = new URL(`${API_URL}/v1/dns-settings/domains/${domain}/contacts`);

    let info = {
      contactAdmin: adminContact,
      contactBilling: billingContact,
      contactRegistrant: registrantContact,
      contactTech: techContact
    };

    try {
      const res = await fetch(requestUrl, {
        method: "PATCH",
        body: JSON.stringify(info)
      });

      const data = await res.json();

      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        const firstErrorKey = Object.keys(data.errors)[0];
        const firstError = data.errors[firstErrorKey];
        const firstErrorMsg = firstError[Object.keys(firstError)[0]];

        toast.warn(`${firstErrorKey}: ${firstErrorMsg}`);
        return;
      } else {
        toast.success("Contacts were updated!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    domain ? (
      <div className="flex flex-col gap-5 mt-5">
        <h4 className="text-xl font-semibold">Contact Information</h4>
        <ContactSection
          title="Admin Contact"
          contactData={adminContact}
          setContactData={setAdminContact}
          handleSubmit={handleSubmit}
        />
        <ContactSection
          title="Billing Contact"
          contactData={billingContact}
          setContactData={setBillingContact}
          handleSubmit={handleSubmit}
        />
        <ContactSection
          title="Registrant Contact"
          contactData={registrantContact}
          setContactData={setRegistrantContact}
          handleSubmit={handleSubmit}
        />
        <ContactSection
          title="Tech Contact"
          contactData={techContact}
          setContactData={setTechContact}
          handleSubmit={handleSubmit}
        />
      </div>
    ) : (
      "Loading..."
    )
  );
}
