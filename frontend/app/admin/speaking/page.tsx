'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminSpeakingPage() {
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    part: 1,
    difficulty: 'medium',
    sampleQuestions: [''],
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speaking/topics`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) setTopics(data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speaking/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.success) {
      alert('Topic created successfully!');
      setShowForm(false);
      fetchTopics();
      // Reset form
      setFormData({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        part: 1,
        difficulty: 'medium',
        sampleQuestions: [''],
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speaking/topics/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.success) {
      alert('Topic deleted!');
      fetchTopics();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speaking Topics</h1>
          <p className="text-gray-600 mt-2">Manage speaking practice topics</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Topic'}
        </Button>
      </div>

      {/* Add Topic Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Speaking Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title (English)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Bengali)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Part</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.part}
                    onChange={(e) => setFormData({ ...formData, part: Number(e.target.value) })}
                  >
                    <option value={1}>Part 1</option>
                    <option value={2}>Part 2</option>
                    <option value={3}>Part 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (English)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">Create Topic</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Topics List */}
      <div className="grid gap-6">
        {topics.map((topic: any) => (
          <Card key={topic._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{topic.titleBn}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(topic._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Part {topic.part}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {topic.difficulty}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
