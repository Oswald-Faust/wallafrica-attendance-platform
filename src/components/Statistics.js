import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Statistics({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Présents aujourd&apos;hui</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.presentToday}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Absents aujourd&apos;hui</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.absentToday}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Taux de présence mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.monthlyAttendanceRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
