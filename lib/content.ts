import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Topic, Piece, Tag } from './types';

const piecesDirectory = path.join(process.cwd(), 'content/pieces');
const topicsDirectory = path.join(process.cwd(), 'content/topics');

export function getAllTopics(): Topic[] {
  if (!fs.existsSync(topicsDirectory)) return [];
  const fileNames = fs.readdirSync(topicsDirectory);
  return fileNames
    .filter(fn => fn.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(topicsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Topic;
    });
}

export function getTopicById(id: string): Topic | undefined {
  const topics = getAllTopics();
  return topics.find((t) => t.id === id);
}

export function getAllPieces(): Piece[] {
  if (!fs.existsSync(piecesDirectory)) return [];
  const fileNames = fs.readdirSync(piecesDirectory);
  return fileNames
    .filter(fn => fn.endsWith('.mdx') || fn.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(piecesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        topic_id: data.topic_id,
        format: data.format,
        title: data.title,
        summary: data.summary || '',
        tags: data.tags || [],
        content_raw: content,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPiecesByTopic(topicId: string): Piece[] {
  return getAllPieces().filter((p) => p.topic_id === topicId);
}

export function getPieceById(id: string): Piece | undefined {
  return getAllPieces().find((p) => p.id === id);
}

export function getAllTags(): Tag[] {
  const pieces = getAllPieces();
  const tagsMap = new Map<string, Tag>();
  
  pieces.forEach((piece) => {
    piece.tags.forEach((tag) => {
      const tagId = tag.toLowerCase().replace(/ /g, '_');
      if (!tagsMap.has(tagId)) {
        tagsMap.set(tagId, { id: tagId, name: tag });
      }
    });
  });

  return Array.from(tagsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPiecesByTag(tagId: string): Piece[] {
  return getAllPieces().filter((p) => 
    p.tags.some(t => t.toLowerCase().replace(/ /g, '_') === tagId)
  );
}
