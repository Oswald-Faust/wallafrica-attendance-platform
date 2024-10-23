import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserPresenceHistory from './UserPresenceHistory';
import ManualPresenceForm from './ManualPresenceForm';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function UserProfile({ user, onClose }) {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center space-x-4 pb-8 border-b">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-bold">{user.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="history">Historique de présence</TabsTrigger>
            <TabsTrigger value="manual">Enregistrement manuel</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<Mail className="mr-2" />} label="Email" value={user.email} />
              <InfoItem icon={<Phone className="mr-2" />} label="Téléphone" value={user.phone} />
              <InfoItem icon={<MapPin className="mr-2" />} label="Adresse" value={user.address} />
              <InfoItem icon={<Calendar className="mr-2" />} label="Date d'embauche" value={user.hireDate} />
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <UserPresenceHistory userId={user._id} />
          </TabsContent>
          <TabsContent value="manual" className="mt-6">
            <ManualPresenceForm userId={user._id} userName={user.fullName} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center p-3 bg-secondary rounded-lg">
      {icon}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
