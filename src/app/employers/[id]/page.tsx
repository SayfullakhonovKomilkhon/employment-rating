"use client";

import { useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Mail, Phone, Globe, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEmployers } from "@/hooks/useEmployers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EmployerProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { byId } = useEmployers();

  const employer = byId(Number(id));

  if (!employer) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Работодатель не найден</h1>
          <p className="text-muted-foreground mb-4">Данный профиль может быть удален.</p>
          <Button onClick={() => router.push("/employers")}>Назад к работодателям</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/employers")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к работодателям
            </Button>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-xl font-semibold">Профиль работодателя</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <Card>
              <CardContent className="p-6 text-center">
                {employer.logo ? (
                  <img
                    src={employer.logo}
                    alt={employer.companyName}
                    className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-16 h-16 text-primary" />
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-1">{employer.companyName}</h2>
                <p className="text-lg text-muted-foreground mb-4">{employer.contactPerson}</p>
                
                <Button 
                  onClick={() => router.push(`/employers/${id}/edit`)} 
                  variant="outline" 
                  className="w-full mb-3"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать профиль
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${employer.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {employer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a 
                    href={`tel:${employer.phone}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {employer.phone}
                  </a>
                </div>
                {employer.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors truncate"
                    >
                      {employer.website}
                    </a>
                  </div>
                )}
                {employer.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{employer.address}</span>
                  </div>
                )}
                <Separator />
                <div>
                  <p className="font-medium text-foreground mb-2">Отрасль</p>
                  <Badge variant="secondary">{employer.industry}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground mb-2">Добавлено</p>
                  <p className="text-sm text-muted-foreground">{employer.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">О компании</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {employer.description || "Описание компании не предоставлено."}
                </p>
              </CardContent>
            </Card>

            {/* Statistics or additional info could go here */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-1">ID компании</p>
                    <p className="text-muted-foreground">#{employer.id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Статус</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Активен
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
