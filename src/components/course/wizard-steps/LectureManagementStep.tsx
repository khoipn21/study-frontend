import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Clock,
  Edit,
  Eye,
  FileText,
  GripVertical,
  HelpCircle,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import type {
  CourseCreationData,
  LectureCreationData,
} from '@/lib/course-management-types'
import type { DragEndEvent } from '@dnd-kit/core'

// Types

interface LectureManagementStepProps {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

interface SortableLectureCardProps {
  lecture: LectureCreationData
  index: number
  onEdit: () => void
  onDelete: () => void
}

function SortableLectureCard({
  lecture,
  index,
  onEdit,
  onDelete,
}: SortableLectureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lecture.id ?? `lecture-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getTypeIcon = () => {
    switch (lecture.type) {
      case 'video':
        return <Play className="w-4 h-4" />
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />
      case 'reading':
        return <FileText className="w-4 h-4" />
      case 'assignment':
        return <Edit className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (lecture.type) {
      case 'video':
        return 'bg-blue-100 text-blue-600'
      case 'quiz':
        return 'bg-green-100 text-green-600'
      case 'reading':
        return 'bg-purple-100 text-purple-600'
      case 'assignment':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 hover:bg-muted rounded"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="w-8 h-6 text-xs font-medium">
              {index + 1}
            </Badge>
            <div className={`p-2 rounded ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{lecture.title}</h4>
              {lecture.is_free && (
                <Badge variant="secondary" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Free Preview
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="capitalize">{lecture.type}</span>
              {lecture.duration_minutes > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lecture.duration_minutes} min</span>
                </div>
              )}
              {lecture.description !== '' && (
                <span className="truncate max-w-xs">{lecture.description}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LectureDialogProps {
  lecture?: LectureCreationData
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (lecture: LectureCreationData) => void
}

function LectureDialog({
  lecture,
  open,
  onOpenChange,
  onSave,
}: LectureDialogProps) {
  const [lectureForm, setLectureForm] = useState({
    id: lecture?.id ?? '',
    title: lecture?.title ?? '',
    description: lecture?.description ?? '',
    type: lecture?.type ?? 'video',
    duration_minutes: lecture?.duration_minutes ?? 0,
    is_free: lecture?.is_free ?? false,
  })

  const watchedType = lectureForm.type

  useEffect(() => {
    if (lecture) {
      setLectureForm({
        id: lecture.id ?? '',
        title: lecture.title ?? '',
        description: lecture.description ?? '',
        type: lecture.type ?? 'video',
        duration_minutes: lecture.duration_minutes ?? 0,
        is_free: lecture.is_free ?? false,
      })
    }
  }, [lecture])

  const handleSave = () => {
    onSave({
      ...lectureForm,
      id: lectureForm.id || `lecture-${Date.now()}`,
      order_number: 0, // Will be set by parent component
    })
    onOpenChange(false)
    setLectureForm({
      id: '',
      title: '',
      description: '',
      type: 'video',
      duration_minutes: 0,
      is_free: false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {lecture ? 'Edit Lecture' : 'Add New Lecture'}
          </DialogTitle>
          <DialogDescription>
            Create engaging content for your students. You can reorder lectures
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormItem>
            <FormLabel>Lecture Title *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Introduction to React Hooks"
                value={lectureForm.title}
                onChange={(e) =>
                  setLectureForm({ ...lectureForm, title: e.target.value })
                }
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Content Type</FormLabel>
            <Select
              value={lectureForm.type}
              onValueChange={(
                value: 'video' | 'quiz' | 'reading' | 'assignment',
              ) => setLectureForm({ ...lectureForm, type: value })}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="video">Video Lesson</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="reading">Reading Material</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {watchedType === 'video' && (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  value={lectureForm.duration_minutes}
                  onChange={(e) =>
                    setLectureForm({
                      ...lectureForm,
                      duration_minutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </FormControl>
              <FormDescription>
                Estimated viewing time for this video
              </FormDescription>
            </FormItem>
          )}

          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of what students will learn..."
                value={lectureForm.description}
                onChange={(e) =>
                  setLectureForm({
                    ...lectureForm,
                    description: e.target.value,
                  })
                }
                className="resize-none"
                rows={3}
              />
            </FormControl>
          </FormItem>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_free"
              checked={lectureForm.is_free}
              onCheckedChange={(checked) =>
                setLectureForm({ ...lectureForm, is_free: checked })
              }
            />
            <Label htmlFor="is_free" className="text-sm">
              Allow free preview
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {lecture ? 'Update Lecture' : 'Add Lecture'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function LectureManagementStep({
  formData,
  onUpdate,
  errors,
  onNext,
}: LectureManagementStepProps) {
  const { watch, setValue } = useFormContext<CourseCreationData>()

  const lectures = watch('lectures') ?? []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLecture, setEditingLecture] = useState<
    LectureCreationData | undefined
  >()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over) {
      const oldIndex = lectures.findIndex(
        (item) =>
          (item.id ?? `lecture-${lectures.indexOf(item)}`) === active.id,
      )
      const newIndex = lectures.findIndex(
        (item) => (item.id ?? `lecture-${lectures.indexOf(item)}`) === over.id,
      )

      const newLectures = arrayMove(lectures, oldIndex, newIndex).map(
        (lecture, index) => ({
          ...lecture,
          order_number: index + 1,
        }),
      )

      setValue('lectures', newLectures)
      onUpdate({ lectures: newLectures })
    }
  }

  const addLecture = (lectureData: LectureCreationData) => {
    const newLecture = {
      ...lectureData,
      order_number: lectures.length + 1,
    }
    const newLectures = [...lectures, newLecture]
    setValue('lectures', newLectures)
    onUpdate({ lectures: newLectures })
  }

  const updateLecture = (lectureData: LectureCreationData) => {
    const newLectures = lectures.map((lecture) =>
      lecture.id === lectureData.id ? lectureData : lecture,
    )
    setValue('lectures', newLectures)
    onUpdate({ lectures: newLectures })
  }

  const deleteLecture = (lectureId: string) => {
    const newLectures = lectures
      .filter((lecture) => lecture.id !== lectureId)
      .map((lecture, index) => ({
        ...lecture,
        order_number: index + 1,
      }))
    setValue('lectures', newLectures)
    onUpdate({ lectures: newLectures })
  }

  const openEditDialog = (lecture: LectureCreationData) => {
    setEditingLecture(lecture)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setEditingLecture(undefined)
    setIsDialogOpen(false)
  }

  const getTotalDuration = () => {
    return lectures.reduce(
      (total, lecture) => total + (lecture.duration_minutes ?? 0),
      0,
    )
  }

  const getContentTypeCounts = () => {
    const counts = { video: 0, quiz: 0, reading: 0, assignment: 0 }
    lectures.forEach((lecture) => {
      counts[lecture.type]++
    })
    return counts
  }

  const contentCounts = getContentTypeCounts()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Course Lectures
        </h2>
        <p className="text-muted-foreground mt-2">
          Create and organize your course content. You can reorder lectures by
          dragging them.
        </p>
      </div>

      <div className="space-y-6">
        {/* Course Overview */}
        {lectures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{lectures.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Lectures
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {Math.floor(getTotalDuration() / 60)}h{' '}
                    {getTotalDuration() % 60}m
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Duration
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{contentCounts.video}</p>
                  <p className="text-xs text-muted-foreground">Video Lessons</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {contentCounts.quiz + contentCounts.assignment}
                  </p>
                  <p className="text-xs text-muted-foreground">Activities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Lecture Button */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Lecture Content</h3>
            <p className="text-sm text-muted-foreground">
              {lectures.length === 0
                ? 'Start by adding your first lecture'
                : `${lectures.length} lecture${lectures.length > 1 ? 's' : ''} created`}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lecture
          </Button>
        </div>

        {/* Lectures List */}
        {lectures.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={lectures.map(
                (lecture, index) => lecture.id ?? `lecture-${index}`,
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {lectures.map((lecture, index) => (
                  <SortableLectureCard
                    key={lecture.id ?? `lecture-${index}`}
                    lecture={lecture}
                    index={index}
                    onEdit={() => openEditDialog(lecture)}
                    onDelete={() => lecture.id !== null && lecture.id !== undefined && lecture.id !== '' && deleteLecture(lecture.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">No lectures yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start building your course by adding your first lecture
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Lecture
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {lectures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>
                Manage multiple lectures at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Import from Template
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Export Structure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm('Are you sure you want to delete all lectures?')
                    ) {
                      setValue('lectures', [])
                      onUpdate({ lectures: [] })
                    }
                  }}
                  disabled={lectures.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lecture Dialog */}
      <LectureDialog
        lecture={editingLecture}
        open={isDialogOpen}
        onOpenChange={closeDialog}
        onSave={editingLecture ? updateLecture : addLecture}
      />
    </div>
  )
}
