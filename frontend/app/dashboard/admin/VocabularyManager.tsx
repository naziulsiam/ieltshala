'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface VocabularyWord {
  _id: string;
  word: string;
  definition: string;
  definitionBangla?: string;
  partOfSpeech: string;
  pronunciation: string;
  example: string;
  exampleBangla?: string;
  synonyms: string[];
  antonyms: string[];
  category: string;
  difficulty: string;
  bandLevel: number;
}

export default function VocabularyManager() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    definitionBangla: '',
    partOfSpeech: 'noun',
    pronunciation: '',
    example: '',
    exampleBangla: '',
    synonyms: '',
    antonyms: '',
    category: 'general',
    difficulty: 'intermediate',
    bandLevel: 6,
  });

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/vocabulary/all?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setWords(data.words);
      }
    } catch (error) {
      toast.error('Failed to load vocabulary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        synonyms: formData.synonyms.split(',').map(s => s.trim()).filter(s => s),
        antonyms: formData.antonyms.split(',').map(s => s.trim()).filter(s => s),
      };

      const url = editingWord
        ? `http://localhost:5000/api/admin/vocabulary/${editingWord._id}`
        : 'http://localhost:5000/api/admin/vocabulary/add';

      const response = await fetch(url, {
        method: editingWord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingWord ? 'Word updated!' : 'Word added!');
        resetForm();
        fetchWords();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to save word');
    }
  };

  const resetForm = () => {
    setFormData({
      word: '',
      definition: '',
      definitionBangla: '',
      partOfSpeech: 'noun',
      pronunciation: '',
      example: '',
      exampleBangla: '',
      synonyms: '',
      antonyms: '',
      category: 'general',
      difficulty: 'intermediate',
      bandLevel: 6,
    });
    setEditingWord(null);
    setShowAddForm(false);
  };

  const handleEdit = (word: VocabularyWord) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      definition: word.definition,
      definitionBangla: word.definitionBangla || '',
      partOfSpeech: word.partOfSpeech,
      pronunciation: word.pronunciation,
      example: word.example,
      exampleBangla: word.exampleBangla || '',
      synonyms: word.synonyms.join(', '),
      antonyms: word.antonyms.join(', '),
      category: word.category,
      difficulty: word.difficulty,
      bandLevel: word.bandLevel,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this word?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/vocabulary/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Word deleted!');
        fetchWords();
      }
    } catch (error) {
      toast.error('Failed to delete word');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vocabulary Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Word'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingWord ? 'Edit Word' : 'Add New Word'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields - same as before but shorter */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Word *"
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Pronunciation"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <textarea
                placeholder="Definition (English) *"
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Definition (বাংলা)"
                value={formData.definitionBangla}
                onChange={(e) => setFormData({ ...formData, definitionBangla: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <Button type="submit">
                {editingWord ? 'Update Word' : 'Add Word'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Words table - same as before */}
      <Card>
        <CardHeader>
          <CardTitle>All Words ({words.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {words.map((word) => (
              <div key={word._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-bold">{word.word}</p>
                  <p className="text-sm text-gray-600">{word.definition.substring(0, 50)}...</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(word)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(word._id)} className="text-red-600">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
