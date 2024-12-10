"use client"

import SparklesText from "@/components/ui/sparkles-text";
import Navbar from "./components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Slider from "./components/Slider";
import ReviewSlider from "./components/ReviewSlider";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [popularDomains, setPopularDomains] = useState([]);

  const fetch = useFetch();

  const getDomains = async () => {
    const requestUrl = new URL(`${API_URL}/v1/domains/status/auction-active`);
    
    const res = await fetch(requestUrl, {
      method: "GET"
    });

    const { status, data } = await wrapperFetchJsonResponse(res);
    const responseData = (data as any).data;

    if (status >= 200) {
      setPopularDomains(responseData);
    }
  }

  useEffect(() => {
    (async () => {
      await getDomains();
    })();
  }, []);

  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Hero */}
      <div className="relative hero bg-primary text-white h-[100vh] w-full flex flex-col justify-center gap-5 items-center pb-[150px]">
        <h1 className="flex gap-2 text-6xl flex-col font-semibold text-center z-[3]">
          <div className="flex gap-4 items-center justify-center">
            Lease a <SparklesText text="premium" className="text-secondary" />
          </div>
          <div className="flex gap-2 items-center justify-center">
            domain <span className="curve">today</span>
          </div>
        </h1>

        <p className="text-center text-muted">Elevate your online presence with our superior hosting and<br />domain services</p>

        <div className="flex">
          <Input type="email" placeholder="Find your domain name" className="w-max rounded-tr-none rounded-br-none" />

          <Select>
            <SelectTrigger className="w-[80px] rounded-none">
              <SelectValue placeholder=".com" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".com">.com</SelectItem>
              <SelectItem value=".net">.net</SelectItem>
              <SelectItem value=".org">.org</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="secondary" className="rounded-tl-none rounded-bl-none">Search</Button>
        </div>
      </div>

      {/* Body */}
      <section className="relative z-10 p-5 px-24 -mt-[80px]">
        <img src="/blob.svg" className="absolute -top-[100px] -left-[200px] -z-[1]" />

        <h2 className="text-5xl font-semibold text-center z-[3]">
          Explore our <span className="text-secondary">top domains</span> and<br /><span className="text-secondary">categories</span>
        </h2>

        <p className="text-center text-muted my-5">Our most popular domains and categories to find your perfect match</p>

        <div className="flex justify-between gap-10 bg-transparent rounded-md p-5">
          <div className="w-full">
            <span className="text-primary font-semibold text-lg">
              Popular domains
            </span>

            <div className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    popularDomains.length ?
                      popularDomains.map((domain: any, i) => (
                        <TableRow key={i}>
                          <TableCell><Link href={`/domains/${domain.id}`}>{domain.url}</Link></TableCell>
                          <TableCell className="text-right">${domain.current_highest_bid}</TableCell>
                        </TableRow>
                      )) :
                      <TableRow>
                        <TableCell>No domains available</TableCell>
                        <TableCell> </TableCell>
                      </TableRow>
                  }
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-full">
            <span className="text-primary font-semibold text-lg">
              Trending Categories
            </span>

            <div className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    [...Array(4)].map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>animal/pets</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <img src="/group-image-1.png" alt="Services" className="my-10 max-h-[400px] object-cover w-full" />

      <section className="relative pt-24 px-24">

        <h2 className="text-5xl font-semibold text-center z-[3]">
          <span className="text-secondary">Why lease</span> a domain from us
        </h2>

        <p className="text-center text-muted my-5">
          We offer affordable lease prices, we do this to give start-ups access to a premium domain name that would<br />otherwise cost them thousands of pounds upfront
        </p>

        <div className="grid grid-cols-1 gap-4">
          <Card className="overflow-hidden border-none">
            <img src="/card-1.png" className="object-cover w-full max-h-[300px]"/>

            <CardHeader className="bg-[#E5F4E3]">
              <CardTitle>Cancel Anytime</CardTitle>
              <CardDescription>No penalties or catches</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden border-none">
              <img src="/card-2.png" className="object-cover w-full max-h-[300px]"/>

              <CardHeader className="bg-[#E5F4E3]">
                <CardTitle>Lease Forever</CardTitle>
                <CardDescription>No penalties</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-none">
              <img src="/card-3.png" className="object-cover w-full max-h-[300px]"/>

              <CardHeader className="bg-[#E5F4E3]">
                <CardTitle>Premium names</CardTitle>
                <CardDescription>Great prices for startups</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative pt-24 px-24">
        <img src="/blob.svg" className="absolute -top-[100px] -left-[200px] -z-[1]" />

        <div className="mb-10">
          <h2 className="text-5xl font-semibold text-center z-[3]">
            Our Process
          </h2>

          <p className="text-center text-muted mt-2">
            Learn more about how we operate in-house to lease you domains
          </p>
        </div>

        <Slider />
      </section>

      <section className="pt-24 px-24">
        <div className="mb-10">
          <h2 className="text-5xl font-semibold text-center z-[3]">
            Reviews
          </h2>
        </div>
      </section>
      
      <ReviewSlider />

      <section className="pt-24 px-24 mb-24">
        <div className="mb-10">
          <h2 className="text-5xl font-semibold text-center z-[3]">
            Our Partners
          </h2>

          <p className="text-center text-muted mt-2">
            See what our clients' have to say about our services
          </p>

          <img src="/partners.png" alt="" className="my-10" />
        </div>
      </section>
    </div>
  );
}
