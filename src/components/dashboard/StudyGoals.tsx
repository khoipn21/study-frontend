import React, { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { StudyGoal } from '@/lib/dashboard'

interface StudyGoalsProps {
  goals: Array<StudyGoal>
  onCreateGoal?: (
    goal: Omit<StudyGoal, 'id' | 'current' | 'isCompleted' | 'createdAt'>,
  ) => void
  onUpdateGoal?: (goalId: string, progress: number) => void
  onDeleteGoal?: (goalId: string) => void
  className?: string
}

export function StudyGoals({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  className,
}: StudyGoalsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily' as StudyGoal['type'],
    target: 30,
    unit: 'minutes' as StudyGoal['unit'],
    deadline: '',
  })

  const handleCreateGoal = () => {
    if (!formData.title.trim()) return

    const goalData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      target: formData.target,
      unit: formData.unit,
      deadline: formData.deadline || undefined,
    }

    onCreateGoal?.(goalData)
    setIsCreateDialogOpen(false)
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      target: 30,
      unit: 'minutes',
      deadline: '',
    })
  }

  const getGoalTypeIcon = (type: StudyGoal['type']) => {
    switch (type) {
      case 'daily':
        return Clock
      case 'weekly':
        return Calendar
      case 'monthly':
        return TrendingUp
      case 'custom':
        return Target
      default:
        return Target
    }
  }

  const getGoalTypeColor = (type: StudyGoal['type']) => {
    switch (type) {
      case 'daily':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'weekly':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'monthly':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'custom':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays <= 7) return `Due in ${diffDays} days`
    return date.toLocaleDateString()
  }

  const getProgressColor = (
    progress: number,
    target: number,
    isCompleted: boolean,
  ) => {
    if (isCompleted) return 'text-green-600'
    const percentage = (progress / target) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-blue-600'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Study Goals</h3>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Goal</DialogTitle>
              <DialogDescription>
                Set a new learning goal to stay motivated and track your
                progress.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Course"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What do you want to achieve?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Goal Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: value as StudyGoal['type'],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit: value as StudyGoal['unit'],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="lectures">Lectures</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="forum_posts">Forum Posts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        target: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>

                {formData.type === 'custom' && (
                  <div>
                    <Label htmlFor="deadline">Deadline (optional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGoal}
                disabled={!formData.title.trim()}
              >
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="academic-card p-8 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No study goals set</h3>
          <p className="text-muted-foreground mb-4">
            Create your first goal to stay motivated and track your progress.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const Icon = getGoalTypeIcon(goal.type)
            const colorClasses = getGoalTypeColor(goal.type)
            const progressPercentage = (goal.current / goal.target) * 100
            const deadline = formatDeadline(goal.deadline)
            const progressColor = getProgressColor(
              goal.current,
              goal.target,
              goal.isCompleted,
            )

            return (
              <div key={goal.id} className="academic-card p-4">
                <div className="flex items-start gap-3">
                  {/* Goal Type Icon */}
                  <div className={cn('p-2 rounded-lg border', colorClasses)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Goal Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-3">
                        {onDeleteGoal && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteGoal(goal.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn('font-medium', progressColor)}>
                          {goal.current} / {goal.target} {goal.unit}
                          {goal.isCompleted && (
                            <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>

                      <Progress
                        value={Math.min(progressPercentage, 100)}
                        className="h-2"
                      />

                      {/* Deadline Info */}
                      {deadline && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground capitalize">
                            {goal.type} goal
                          </span>
                          <span
                            className={cn(
                              'font-medium',
                              deadline.includes('Overdue')
                                ? 'text-destructive'
                                : deadline.includes('today') ||
                                    deadline.includes('tomorrow')
                                  ? 'text-warning'
                                  : 'text-muted-foreground',
                            )}
                          >
                            {deadline}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
