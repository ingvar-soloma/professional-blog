import React from 'react';
import { ChevronRight, Calendar, User, Clock, Eye } from 'lucide-react';
import {
  Stack,
  Heading,
  Text,
  Badge,
  Card,
  IconBox
} from './primitives/SystemicEngine';

export default function BlogCard({ post }) {
  const { title, date, excerpt, author, read_time, tags, views } = post;

  return (
    <Card interactive padding="8">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={18} className="text-red-600" />
      </div>

      <Stack gap={8}>
        <Stack gap={4}>
          <Heading level={3}>{title}</Heading>
          
          <Text muted size="sm">
            {excerpt}
          </Text>

          <Stack vertical={false} wrap gap={2} className="pt-2">
            {tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </Stack>
        </Stack>

        <footer className="pt-6 border-t border-white/5">
          <Stack vertical={false} justify="between" align="center" fullWidth gap={4} wrap>
            <Stack vertical={false} align="center" gap={4}>
               <Stack vertical={false} align="center" gap={1.5}>
                  <Calendar size={14} className="text-red-900" />
                  <Text size="sm" mono muted>{date}</Text>
               </Stack>
                <Stack vertical={false} align="center" gap={1.5}>
                  <Clock size={14} className="text-red-900" />
                  <Text size="sm" mono muted>{read_time || '5 min'}</Text>
                </Stack>
                {views !== undefined && (
                  <Stack vertical={false} align="center" gap={1.5}>
                    <Eye size={14} className="text-red-900" />
                    <Text size="sm" mono muted>{views}</Text>
                  </Stack>
                )}
             </Stack>
             
             <Stack vertical={false} align="center" gap={1.5}>
                <User size={14} className="text-red-900" />
                <Text size="sm" mono muted>{author || 'Ihor S.'}</Text>
             </Stack>
          </Stack>
        </footer>
      </Stack>
    </Card>
  );
}
