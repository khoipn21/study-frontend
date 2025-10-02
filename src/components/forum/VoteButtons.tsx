import { ArrowDown, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useRemoveVote, useVotePost } from '@/hooks/use-forum'
import { useAuth } from '@/lib/auth-context'

interface VoteButtonsProps {
  post: {
    id: string
    vote_total?: number
    user_vote?: 'up' | 'down' | null
  }
}

export function VoteButtons({ post }: VoteButtonsProps) {
  const { token } = useAuth()
  const votePost = useVotePost()
  const removeVote = useRemoveVote()

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!token) {
      toast.error('Please sign in to vote')
      return
    }

    try {
      if (post.user_vote === voteType) {
        // Remove vote if clicking same button
        await removeVote.mutateAsync({ postId: post.id, authToken: token })
        toast.success('Vote removed')
      } else {
        // Vote or change vote
        await votePost.mutateAsync({
          postId: post.id,
          voteType,
          authToken: token,
        })
        toast.success(voteType === 'up' ? 'Upvoted!' : 'Downvoted!')
      }
    } catch (error) {
      toast.error('Failed to vote. Please try again.')
      console.error('Vote error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="sm"
        variant={post.user_vote === 'up' ? 'default' : 'ghost'}
        onClick={() => handleVote('up')}
        disabled={!token || votePost.isPending || removeVote.isPending}
        className="h-8 w-8 p-0"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium tabular-nums">
        {post.vote_total || 0}
      </span>
      <Button
        size="sm"
        variant={post.user_vote === 'down' ? 'default' : 'ghost'}
        onClick={() => handleVote('down')}
        disabled={!token || votePost.isPending || removeVote.isPending}
        className="h-8 w-8 p-0"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
