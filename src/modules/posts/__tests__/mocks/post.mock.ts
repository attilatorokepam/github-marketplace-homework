import { CreatePostDto } from '../../dtos/create-post.dto';
import { Post } from '../../entities/post.entity';

export const mockPost: Post = {
  id: 1,
  title: 'Mock Post Title',
  body: 'Mock post body content.',
  userId: 1,
};

export const mockPosts: Post[] = [
  mockPost,
  {
    id: 2,
    title: 'Another Post',
    body: 'Another post body.',
    userId: 2,
  },
];

export const mockCreatePostDto: CreatePostDto = {
  title: 'New Post',
  body: 'New post body.',
  userId: 1,
};

export const mockUpdatePostDto: Partial<CreatePostDto> = {
  title: 'Updated Title',
  body: 'Updated body.',
};
