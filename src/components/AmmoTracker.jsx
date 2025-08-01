import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Minus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function AmmoTracker({ ammoInventory, updateAmmoInventory, handleUseAmmo }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    caliber: '',
    count: '',
    brand: '',
    notes: ''
  });
  const { toast } = useToast();

  const ammoTypes = [
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
    
    if (!formData.type || !formData.caliber || !formData.count) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ammoData = {
      type: formData.type,
      caliber: formData.caliber,
      count: parseInt(formData.count),
      brand: formData.brand,
      notes: formData.notes
    };

    updateAmmoInventory(ammoData);
    
    toast({
      title: "Ammo Added!",
      description: `Added ${formData.count} rounds of ${formData.caliber}`
    });

    setFormData({
      type: '',
      caliber: '',
      count: '',
      brand: '',
      notes: ''
    });
    setShowForm(false);
  };

  const triggerUseAmmo = (type, caliber, currentCount) => {
    const amount = prompt(`How many rounds of ${caliber} did you use?`);
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      const useAmount = parseInt(amount);
      if (useAmount <= currentCount) {
        handleUseAmmo(type, caliber, useAmount);
        toast({
          title: "Ammo Used",
          description: `Used ${useAmount} rounds of ${caliber}`
        });
      } else {
        toast({
          title: "Insufficient Ammo",
          description: `You only have ${currentCount} rounds available`,
          variant: "destructive"
        });
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      shotgun: 'from-orange-500 to-red-500',
      rifle22: 'from-green-500 to-blue-500',
      airRifle: 'from-blue-500 to-purple-500',
      airPistol: 'from-purple-500 to-pink-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const lowAmmoItems = ammoInventory.filter(ammo => ammo.count < 50);
  const totalRounds = ammoInventory.reduce((sum, ammo) => sum + ammo.count, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ammo Inventory
          </h1>
          <p className="text-gray-300">Track your ammunition supply and usage</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="shooting-gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ammo
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{totalRounds}</div>
              <p className="text-xs text-gray-400">Rounds in inventory</p>
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
              <CardTitle className="text-sm font-medium">Ammo Types</CardTitle>
              <Package className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{ammoInventory.length}</div>
              <p className="text-xs text-gray-400">Different calibers</p>
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
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold score-highlight">{lowAmmoItems.length}</div>
              <p className="text-xs text-gray-400">Items below 50 rounds</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {lowAmmoItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="stats-card border-orange-500/30 bg-orange-500/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Low Ammo Alert</span>
              </CardTitle>
              <CardDescription>The following ammunition types are running low:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowAmmoItems.map((ammo) => (
                  <div key={ammo.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/20">
                    <div>
                      <p className="font-medium">{ammo.caliber}</p>
                      <p className="text-sm text-gray-400 capitalize">{ammo.type}</p>
                    </div>
                    <Badge variant="destructive" className="ammo-counter">
                      {ammo.count} rounds
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="stats-card">
            <CardHeader>
              <CardTitle>Add Ammunition</CardTitle>
              <CardDescription>Add new ammunition to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value, caliber: '' })}
                      required
                    >
                      <option value="">Select type</option>
                      {ammoTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </Select>
                  </div>

                  {formData.type && (
                    <div className="space-y-2">
                      <Label htmlFor="caliber">Caliber *</Label>
                      <Select
                        value={formData.caliber}
                        onChange={(e) => setFormData({ ...formData, caliber: e.target.value })}
                        required
                      >
                        <option value="">Select caliber</option>
                        {calibers[formData.type]?.map(cal => (
                          <option key={cal} value={cal}>{cal}</option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="count">Count *</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                      placeholder="Number of rounds"
                      className="glass-effect border-white/30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Federal, Winchester"
                      className="glass-effect border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="glass-effect border-white/30"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="shooting-gradient">
                    Add to Inventory
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
        {ammoInventory.length > 0 ? (
          ammoInventory.map((ammo, index) => (
            <motion.div
              key={ammo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="stats-card hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(ammo.type)}`}>
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <Badge 
                      variant={ammo.count < 50 ? "destructive" : "secondary"}
                      className="ammo-counter"
                    >
                      {ammo.count} rounds
                    </Badge>
                  </div>
                  <CardTitle>{ammo.caliber}</CardTitle>
                  <CardDescription className="capitalize">
                    {ammo.type.replace(/([A-Z])/g, ' $1').trim()}
                    {ammo.brand && ` • ${ammo.brand}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ammo.notes && (
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-sm text-gray-300">{ammo.notes}</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerUseAmmo(ammo.type, ammo.caliber, ammo.count)}
                        className="flex-1"
                        disabled={ammo.count === 0}
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                    </div>
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
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Ammo Inventory</h3>
                <p className="text-gray-400 mb-4">Start tracking your ammunition by adding your first entry</p>
                <Button onClick={() => setShowForm(true)} className="shooting-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Ammo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}