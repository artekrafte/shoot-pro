
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award, Zap, Crosshair } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function Dashboard({ sessions, targets, ammoInventory }) {
  const totalSessions = sessions.length;
  const totalShots = sessions.reduce((sum, session) => sum + (session.shotsFired || 0), 0);
  const averageScore = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
    : 0;

  const recentSessions = sessions.slice(-5).reverse();
  const lowAmmo = ammoInventory.filter(ammo => ammo.count < 50);

  const disciplines = [
    { name: 'Shotgun', icon: Target, color: 'from-orange-500 to-red-500', sessions: sessions.filter(s => s.discipline === 'shotgun').length },
    { name: '.22 Rifle', icon: Crosshair, color: 'from-green-500 to-blue-500', sessions: sessions.filter(s => s.discipline === 'rifle22').length },
    { name: 'Air Rifle', icon: Zap, color: 'from-blue-500 to-purple-500', sessions: sessions.filter(s => s.discipline === 'airRifle').length },
    { name: 'Air Pistol', icon: Award, color: 'from-purple-500 to-pink-500', sessions: sessions.filter(s => s.discipline === 'airPistol').length },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-300">Track your shooting progress and performance</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{totalSessions}</div>
              <p className="text-xs text-gray-400">Training sessions completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shots</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{totalShots}</div>
              <p className="text-xs text-gray-400">Shots fired in training</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{averageScore.toFixed(1)}</div>
              <p className="text-xs text-gray-400">Points per session</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Targets Recorded</CardTitle>
              <Award className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{targets.length}</div>
              <p className="text-xs text-gray-400">Target images saved</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Disciplines Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="stats-card">
          <CardHeader>
            <CardTitle>Shooting Disciplines</CardTitle>
            <CardDescription>Your activity across different shooting sports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {disciplines.map((discipline, index) => {
                const Icon = discipline.icon;
                const percentage = totalSessions > 0 ? (discipline.sessions / totalSessions) * 100 : 0;
                
                return (
                  <motion.div
                    key={discipline.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="discipline-card p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${discipline.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{discipline.name}</p>
                        <p className="text-sm text-gray-400">{discipline.sessions} sessions</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="stats-card">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest training activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg glass-effect">
                      <div>
                        <p className="font-medium capitalize">{session.discipline.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          {session.score} pts
                        </Badge>
                        <p className="text-xs text-gray-400">{session.shotsFired} shots</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sessions recorded yet</p>
                  <p className="text-sm">Start tracking your shooting progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ammo Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="stats-card">
            <CardHeader>
              <CardTitle>Ammo Inventory</CardTitle>
              <CardDescription>Current ammunition status</CardDescription>
            </CardHeader>
            <CardContent>
              {ammoInventory.length > 0 ? (
                <div className="space-y-3">
                  {ammoInventory.slice(0, 5).map((ammo) => (
                    <div key={ammo.id} className="flex items-center justify-between p-3 rounded-lg glass-effect">
                      <div>
                        <p className="font-medium">{ammo.caliber}</p>
                        <p className="text-sm text-gray-400 capitalize">{ammo.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={ammo.count < 50 ? "destructive" : "secondary"}
                          className="ammo-counter"
                        >
                          {ammo.count} rounds
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {lowAmmo.length > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                      <p className="text-sm text-red-300">
                        ⚠️ {lowAmmo.length} ammunition type(s) running low
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No ammo inventory yet</p>
                  <p className="text-sm">Add your ammunition to track usage</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
