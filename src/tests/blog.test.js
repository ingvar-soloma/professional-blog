import { describe, it, expect } from 'vitest';
import { parseMarkdownMetadata, stripMetadata } from '../lib/blog-utils';

describe('Blog Utils', () => {
  const sampleMarkdown = `---
title: Systemic Architecture for Aphantasia
date: 2026-03-25
tags: cognitive engineering design
---
# Actual Content here
Test.`;

  it('should correctly parse frontmatter metadata', () => {
    const metadata = parseMarkdownMetadata(sampleMarkdown);
    
    expect(metadata.title).toBe('Systemic Architecture for Aphantasia');
    expect(metadata.date).toBe('2026-03-25');
    expect(metadata.tags).toContain('engineering');
    expect(metadata.tags).toHaveLength(3);
  });

  it('should strip metadata from the final content', () => {
    const content = stripMetadata(sampleMarkdown);
    expect(content.startsWith('# Actual Content')).toBe(true);
    expect(content.includes('---')).toBe(false);
  });

  it('should handle markdown without metadata gracefully', () => {
      const pureMarkdown = '# No metadata here';
      const metadata = parseMarkdownMetadata(pureMarkdown);
      expect(metadata).toEqual({});
      expect(stripMetadata(pureMarkdown)).toBe(pureMarkdown);
  });
});
