import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, Award, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function SessionTracker({ sessions, addSession, handleUseAmmo, ammoInventory }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    discipline: '',
    shotsFired: '',
    score: '',
    notes: '',
    ammoUsed: '',
    caliber: ''
  });
  const { toast } = useToast();

  const disciplines = [
    { value: 'shotgun', label: 'Shotgun' },
    { value: 'rifle22', label: '.22 Rifle' },
    { value: 'airRifle', label: 'Air Rifle' },
    { value: 'airPistol', label: 'Air Pistol' }
  ];

  const calibers = {
    shotgun: ['12 Gauge', '20 Gauge', '28 Gauge', '.410 Bore'],
    rifle22: ['.22 LR', '.22 Short', '.22 Long'],
    airRifle: ['.177', '.22', '.25'],
    airPistol: ['.177', '.22']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.discipline || !formData.shotsFired) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const sessionData = {
      discipline: formData.discipline,
      shotsFired: parseInt(formData.shotsFired),
      score: parseFloat(formData.score) || 0,
      notes: formData.notes,
      ammoUsed: parseInt(formData.ammoUsed) || 0,
      caliber: formData.caliber
    };

    if (formData.ammoUsed && formData.caliber) {
      const amountToUse = parseInt(formData.ammoUsed);
      const availableAmmo = ammoInventory.find(a => a.caliber === formData.caliber)?.count || 0;
      if(amountToUse > availableAmmo) {
        toast({
          title: "Insufficient Ammo",
          description: `You only have ${availableAmmo} rounds of ${formData.caliber}`,
          variant: "destructive"
        });
        return;
      }
      handleUseAmmo(formData.discipline, formData.caliber, amountToUse);
    }

    addSession(sessionData);
    
    toast({
      title: "Session Recorded!",
      description: `Added ${formData.discipline} session with ${formData.shotsFired} shots`
    });

    setFormData({
      discipline: '',
      shotsFired: '',
      score: '',
      notes: '',
      ammoUsed: '',
      caliber: ''
    });
    setShowForm(false);
  };

  const getDisciplineColor = (discipline) => {
    const colors = {
      shotgun: 'from-orange-500 to-red-500',
      rifle22: 'from-green-500 to-blue-500',
      airRifle: 'from-blue-500 to-purple-500',
      airPistol: 'from-purple-500 to-pink-500'
    };
    return colors[discipline] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Training Sessions
          </h1>
          <p className="text-gray-300">Record and track your shooting sessions</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="shooting-gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="stats-card">
            <CardHeader>
              <CardTitle>Record New Session</CardTitle>
              <CardDescription>Add details about your training session</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discipline">Discipline *</Label>
                    <Select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value, caliber: '' })}
                      required
                    >
                      <option value="">Select discipline</option>
                      {disciplines.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shotsFired">Shots Fired *</Label>
                    <Input
                      id="shotsFired"
                      type="number"
                      min="1"
                      value={formData.shotsFired}
                      onChange={(e) => setFormData({ ...formData, shotsFired: e.target.value })}
                      className="glass-effect border-white/30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      className="glass-effect border-white/30"
                    />
                  </div>

                  {formData.discipline && (
                    <div className="space-y-2">
                      <Label htmlFor="caliber">Caliber</Label>
                      <Select
                        value={formData.caliber}
                        onChange={(e) => setFormData({ ...formData, caliber: e.target.value })}
                      >
                        <option value="">Select caliber</option>
                        {calibers[formData.discipline]?.map(cal => (
                          <option key={cal} value={cal}>{cal}</option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="ammoUsed">Ammo Used</Label>
                    <Input
                      id="ammoUsed"
                      type="number"
                      min="0"
                      value={formData.ammoUsed}
                      onChange={(e) => setFormData({ ...formData, ammoUsed: e.target.value })}
                      className="glass-effect border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about your session..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="glass-effect border-white/30"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="shooting-gradient">
                    Record Session
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length > 0 ? (
          sessions.slice().reverse().map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="stats-card hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getDisciplineColor(session.discipline)}`}>
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary">
                      {session.score} pts
                    </Badge>
                  </div>
                  <CardTitle className="capitalize">
                    {session.discipline.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                  <CardDescription>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Shots Fired:</span>
                      <span className="font-medium">{session.shotsFired}</span>
                    </div>
                    {session.caliber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Caliber:</span>
                        <span className="font-medium">{session.caliber}</span>
                      </div>
                    )}
                    {session.ammoUsed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Ammo Used:</span>
                        <span className="font-medium">{session.ammoUsed} rounds</span>
                      </div>
                    )}
                    {session.notes && (
                      <div className="mt-3 p-2 rounded bg-white/5">
                        <p className="text-sm text-gray-300">{session.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full"
          >
            <Card className="stats-card">
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
                <p className="text-gray-400 mb-4">Start tracking your shooting progress by recording your first session</p>
                <Button onClick={() => setShowForm(true)} className="shooting-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Record First Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}