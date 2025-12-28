'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminVocabularyPage() {
  const [words, setWords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    word: '',
    wordBn: '',
    definition: '',
    definitionBn: '',
    pronunciation: '',
    partOfSpeech: 'noun',
    examples: [''],
    synonyms: [''],
    antonyms: [''],
    difficulty: 'intermediate',
    bandLevel: 6,
  });

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vocabulary`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) setWords(data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        examples: formData.examples.filter(e => e.trim()),
        synonyms: formData.synonyms.filter(s => s.trim()),
        antonyms: formData.antonyms.filter(a => a.trim()),
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert('Word added successfully!');
      setShowForm(false);
      fetchWords();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this word?')) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vocabulary/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
      alert('Word deleted!');
      fetchWords();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Management</h1>
          <p className="text-gray-600 mt-2">Add and manage IELTS vocabulary words</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Word'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Vocabulary Word</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Word (English)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Word (Bengali)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.wordBn}
                    onChange={(e) => setFormData({ ...formData, wordBn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Part of Speech</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.partOfSpeech}
                    onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                  >
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Band Level</label>
                  <input
                    type="number"
                    min="5"
                    max="9"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.bandLevel}
                    onChange={(e) => setFormData({ ...formData, bandLevel: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Definition (English)</label>
                <textarea
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                  value={formData.definition}
                  onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">Add Word</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Words ({words.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {words.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No words yet. Add your first word!</p>
          ) : (
            <div className="space-y-2">
              {words.map((word: any) => (
                <div key={word._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-lg">{word.word}</h3>
                    <p className="text-sm text-gray-600">{word.definition}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{word.partOfSpeech}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Band {word.bandLevel}</span>
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(word._id)}>Delete</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
