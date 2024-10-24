import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Statistics({ stats }) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    // Simuler des données d'assiduité sur 30 jours
    const data = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      taux: Math.floor(Math.random() * (100 - 70 + 1) + 70)
    }));
    setAttendanceData(data);

    // Données pour le graphique en camembert
    setPieData([
      { name: 'Présents', value: stats.presentToday },
      { name: 'Absents', value: stats.absentToday }
    ]);
  }, [stats]);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Présents aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{stats.presentToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absents aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{stats.absentToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taux de présence mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{stats.monthlyAttendanceRate}%</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Évolution du taux de présence (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="taux" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Répartition Présents/Absents</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistiques détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Taux d'absentéisme : {((stats.absentToday / (stats.presentToday + stats.absentToday)) * 100).toFixed(2)}%</li>
              <li>Nombre total d'employés : {stats.presentToday + stats.absentToday}</li>
              <li>Jours ouvrés ce mois : {Math.floor(Math.random() * (22 - 18 + 1) + 18)}</li>
              <li>Heures travaillées (estimation) : {stats.presentToday * 8} heures</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
