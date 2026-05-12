'use client';

import { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Globe,
  Brain,
  Palette,
  Cloud,
  Smartphone,
  Shield,
  Briefcase,
  Megaphone,
  Monitor,
  Server,
  Layers,
  Cpu,
  BarChart3,
  Network,
  Figma,
  Image,
  Play,
} from 'lucide-react';
import { mockCategories } from '@/shared/mocks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Brain,
  Palette,
  Cloud,
  Smartphone,
  Shield,
  Briefcase,
  Megaphone,
  Monitor,
  Server,
  Layers,
  Cpu,
  BarChart3,
  Network,
  Figma,
  Image,
  Play,
  FolderTree,
  BookOpen,
};

export function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.children?.length ?? 0),
    0
  );
  const totalCourses = categories.reduce(
    (sum, c) => sum + c.courseCount,
    0
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (cat: (typeof categories)[0]) => {
    setEditingCategory(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingCategory || !editName.trim()) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory
          ? { ...c, name: editName, description: editDescription }
          : c
      )
    );
    setEditDialogOpen(false);
    setEditName('');
    setEditDescription('');
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newCat = {
      id: `cat_${Date.now()}`,
      name: newName,
      description: newDescription,
      icon: 'FolderTree',
      courseCount: 0,
      order: categories.length + 1,
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
    setAddDialogOpen(false);
    setNewName('');
    setNewDescription('');
  };

  const renderIcon = (iconName?: string, className = 'w-5 h-5') => {
    const IconComponent = ICON_MAP[iconName || ''] || FolderTree;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Course Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize and manage course categories
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-primary/20 h-10"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Categories',
            value: totalCategories,
            icon: FolderTree,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
          },
          {
            label: 'Total Subcategories',
            value: totalSubcategories,
            icon: ChevronRight,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
          },
          {
            label: 'Total Courses',
            value: totalCourses,
            icon: BookOpen,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="bg-card border-border shadow-none"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isExpanded = expandedId === category.id;
          const subCount = category.children?.length ?? 0;

          return (
            <div key={category.id} className="space-y-0">
              <Card
                className={`bg-card border-border shadow-none cursor-pointer transition-all duration-200 ${
                  isExpanded
                    ? 'border-[#4F46E5]/40 shadow-lg shadow-[#4F46E5]/5'
                    : 'hover:border-border'
                } ${subCount > 0 ? 'rounded-b-none' : ''}`}
                onClick={() => subCount > 0 && toggleExpand(category.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center shrink-0 text-[#4F46E5]">
                        {renderIcon(category.icon)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {category.name}
                          </h3>
                          {subCount > 0 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-card border-border text-muted-foreground"
                            >
                              {subCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {category.courseCount} courses
                          </span>
                          {subCount > 0 && (
                            <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                              <FolderTree className="w-3 h-3" />
                              {subCount} subcategories
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {subCount > 0 ? (
                        <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-muted-foreground/70">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground/70 hover:text-[#06B6D4] hover:bg-[#06B6D4]/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(category);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground/70 hover:text-red-400 hover:bg-red-400/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(category.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expanded Subcategories */}
              {isExpanded && subCount > 0 && (
                <div className="bg-background border border-t-0 border-border border-[#4F46E5]/20 rounded-b-xl p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                    Subcategories
                  </p>
                  {category.children!.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-card border border-border/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-muted-foreground">
                          {renderIcon(sub.icon, 'w-4 h-4')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground/80">
                            {sub.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground/70">
                            {sub.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-card border-border text-muted-foreground"
                      >
                        {sub.courseCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Category</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update category name and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80 font-medium">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80 font-medium">
                Description
              </Label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Category description..."
                className="h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              className="bg-transparent border-border text-foreground/80 hover:bg-muted hover:text-foreground"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm"
              onClick={handleEditSave}
              disabled={!editName.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Category</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new course category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80 font-medium">Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., DevOps"
                className="h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80 font-medium">
                Description
              </Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Category description..."
                className="h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              className="bg-transparent border-border text-foreground/80 hover:bg-muted hover:text-foreground"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm"
              onClick={handleAdd}
              disabled={!newName.trim()}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
