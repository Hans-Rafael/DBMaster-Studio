export type EngineType = 'postgresql' | 'mongodb' | 'graphql';

export interface Topic {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  summaryPoints: string[];
  theoryMarkdown: string;
  codeExamples: {
    title: string;
    language: 'sql' | 'javascript' | 'graphql' | 'python' | 'bash';
    code: string;
    explanation: string;
  }[];
  dbeaverNote?: string;
  terminalCommand?: string;
  pythonSnippet?: string;
  keyTakeaways: string[];
}

export interface Module {
  id: string;
  number: number;
  engine: EngineType;
  title: string;
  shortDescription: string;
  badge: string;
  iconName: string;
  topics: Topic[];
  estimatedMinutes: number;
}

export interface QuizQuestion {
  id: string;
  topicId?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface Quiz {
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface ExerciseTest {
  name: string;
  expectedResultCheck: (result: QueryResult) => { success: boolean; message: string };
}

export interface PracticalExercise {
  id: string;
  moduleId: string;
  engine: EngineType;
  title: string;
  difficulty: 'fácil' | 'intermedio' | 'avanzado';
  instructions: string;
  hints: string[];
  initialCode: string;
  solutionCode: string;
  solutionExplanation: string;
  expectedOutputSummary?: string;
}

export interface QueryColumn {
  name: string;
  type: string;
}

export interface QueryResult {
  success: boolean;
  rows: Record<string, any>[];
  columns: string[];
  rowCount: number;
  executionTimeMs: number;
  message?: string;
  error?: string;
  affectedRows?: number;
  queryType?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'DDL' | 'MONGO' | 'GRAPHQL' | 'OTHER';
}

export interface UserProgress {
  completedTopics: string[]; // topic IDs
  quizScores: Record<string, number>; // moduleId -> percentage score (0-100)
  completedExercises: string[]; // exercise IDs
  lastActiveTopicId?: string;
  savedQueries: { id: string; name: string; query: string; engine: EngineType; timestamp: number }[];
}
