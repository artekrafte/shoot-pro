
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera, Calendar, Target, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function TargetGallery({ targets, addTarget }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    discipline: '',
    score: '',
    distance: '',
    notes: '',
    imageUrl: ''
  });
  const { toast } = useToast();

  const disciplines = [
    { value: 'shotgun', label: 'Shotgun' },
    { value: 'rifle22', label: '.22 Rifle' },
    { value: 'airRifle', label: 'Air Rifle' },
    { value: 'airPistol', label: 'Air Pistol' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discipline) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and discipline",
        variant: "destructive"
      });
      return;
    }

    const targetData = {
      title: formData.title,
      discipline: formData.discipline,
      score: parseFloat(formData.score) || 0,
      distance: formData.distance,
      notes: formData.notes,
      imageUrl: formData.imageUrl
    };

    addTarget(targetData);
    
    toast({
      title: "Target Added!",
      description: `Added ${formData.title} to your gallery`
    });

    setFormData({
      title: '',
      discipline: '',
      score: '',
      distance: '',
      notes: '',
      imageUrl: ''
    });
    setShowForm(false);
  };

  const handleImageUpload = () => {
    toast({
      title: "🚧 Image upload isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
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
            Target Gallery
          </h1>
          <p className="text-gray-300">Record and view your target achievements</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="shooting-gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Target
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
              <CardTitle>Add New Target</CardTitle>
              <CardDescription>Record your target shooting results</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Target Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Morning Practice Session"
                      className="glass-effect border-white/30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discipline">Discipline *</Label>
                    <Select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      required
                    >
                      <option value="">Select discipline</option>
                      {disciplines.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </Select>
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
                      placeholder="Target score"
                      className="glass-effect border-white/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance</Label>
                    <Input
                      id="distance"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      placeholder="e.g., 25 yards, 50m"
                      className="glass-effect border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Target Image URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Paste image URL here"
                      className="glass-effect border-white/30"
                    />
                    <Button type="button" variant="outline" onClick={handleImageUpload}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this target..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="glass-effect border-white/30"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="shooting-gradient">
                    Add Target
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
        {targets.length > 0 ? (
          targets.slice().reverse().map((target, index) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="stats-card hover:scale-105 transition-transform duration-300 overflow-hidden">
                {target.imageUrl ? (
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img 
                      src={target.imageUrl} 
                      alt={target.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center target-pattern">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getDisciplineColor(target.discipline)}`}>
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    {target.score > 0 && (
                      <Badge variant="secondary">
                        {target.score} pts
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{target.title}</CardTitle>
                  <CardDescription>
                    <span className="capitalize">{target.discipline.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {target.distance && ` • ${target.distance}`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date:</span>
                      <span>{new Date(target.createdAt).toLocaleDateString()}</span>
                    </div>
                    {target.notes && (
                      <div className="mt-3 p-2 rounded bg-white/5">
                        <p className="text-sm text-gray-300">{target.notes}</p>
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
                <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Targets Yet</h3>
                <p className="text-gray-400 mb-4">Start building your target gallery by adding your first target</p>
                <Button onClick={() => setShowForm(true)} className="shooting-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Target
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
