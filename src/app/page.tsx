// MVP für eine Essay-Plattform mit Themenlisten
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const topics = [
  "Climate Change",
  "AI and Ethics",
  "Freedom of Speech",
  "Mental Health",
  "Education Reform"
];

export default function EssayPlatform() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null); // Typ angepasst
  const [essays, setEssays] = useState<Array<{ name: string; content: string; topic: string; date: string }>>([]); // Typen hinzugefügt
  const [form, setForm] = useState({ name: '', content: '' });
  const [error, setError] = useState<string>(''); // Fehlerstatus
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Erfolgsstatus

  // Lade gespeicherte Essays beim Laden der Seite
  useEffect(() => {
    const savedEssays = JSON.parse(localStorage.getItem('essays') || '[]');
    setEssays(savedEssays);
  }, []);

  // Funktion zum Absenden eines neuen Essays
  const handleSubmit = () => {
    if (!selectedTopic || !form.name || !form.content) {
      setError('Bitte füllen Sie alle Felder aus und wählen Sie ein Thema.');
      setIsSuccess(false);
      return;
    }

    const newEssay = {
      ...form,
      topic: selectedTopic,
      date: new Date().toLocaleDateString()
    };

    const updatedEssays = [newEssay, ...essays];
    setEssays(updatedEssays);
    localStorage.setItem('essays', JSON.stringify(updatedEssays)); // Essays in localStorage speichern
    setForm({ name: '', content: '' });
    setError('');
    setIsSuccess(true); // Erfolgsmeldung anzeigen
  };

  return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">📝 Essay Platform MVP</h1>

        {/* Themenkarten */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {topics.map((topic) => (
              <Card
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setIsSuccess(false); // Erfolgsstatus nach Themenauswahl verwerfen
                    setError(''); // Fehlerstatus nach Themenauswahl zurücksetzen
                  }}
                  className={`cursor-pointer transition-transform transform hover:scale-105 ${
                      selectedTopic === topic ? 'bg-blue-200 ring-2 ring-blue-500' : ''
                  }`}
              >
                <CardContent className="p-4 font-semibold">{topic}</CardContent>
              </Card>
          ))}
        </div>

        {/* Erfolgs- oder Fehlermeldung */}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {isSuccess && <p className="text-green-500 mb-2">Essay erfolgreich eingereicht!</p>}

        {/* Formular zur Essay-Eingabe */}
        {selectedTopic && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Write about: {selectedTopic}</h2>
              <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mb-2"
              />
              <Textarea
                  placeholder="Your essay..."
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mb-2"
              />
              <Button onClick={handleSubmit}>Submit Essay</Button>
            </div>
        )}

        {/* Anzeige der Essays */}
        <div className="space-y-4">
          {essays.filter((essay) => essay.topic === selectedTopic).length === 0 ? (
              <p className="text-gray-500">Keine Essays zu diesem Thema gefunden.</p>
          ) : (
              essays
                  .filter((essay) => essay.topic === selectedTopic)
                  .map((essay, idx) => (
                      <Card key={idx} className="shadow">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500">{essay.date} • by {essay.name}</p>
                          <h3 className="text-lg font-bold mt-2 mb-1">{essay.topic}</h3>
                          <p>
                            {essay.content.length > 150
                                ? `${essay.content.slice(0, 150)}...`
                                : essay.content}
                          </p>
                          {essay.content.length > 150 && (
                              <Button onClick={() => alert(essay.content)} className="mt-2">
                                Mehr lesen
                              </Button>
                          )}
                        </CardContent>
                      </Card>
                  ))
          )}
        </div>
      </div>
  );
}
