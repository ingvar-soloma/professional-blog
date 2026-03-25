/**
 * Extracts metadata from the frontmatter of a markdown string.
 * Simple YAML-style parser for teaching and testing purposes.
 */
export function parseMarkdownMetadata(content) {
  const metadata = {};
  const metadataRegex = /^---\s*([\s\S]*?)\s*---\s*/;
  const match = content.match(metadataRegex);
  
  if (match) {
    const yaml = match[1];
    const lines = yaml.split('\n');
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        
        // Handle tags as an array if they are comma-separated or space-separated
        if (key === 'tags') {
          metadata[key] = value.split(/[\s,]+/).filter(Boolean);
        } else {
          metadata[key] = value;
        }
      }
    });
  }
  
  return metadata;
}

/**
 * Strips frontmatter from markdown content
 */
export function stripMetadata(content) {
  return content.replace(/^---\s*([\s\S]*?)\s*---\s*/, '');
}
