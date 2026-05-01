import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [isFocused, setIsFocused] = useState(false);

  // TAMBAH TASK
  const tambahTask = () => {
    if (task.trim() === '') {
      alert('Tugas tidak boleh kosong!');
      return;
    }

    const dataBaru = {
      id: Date.now(),
      text: task.trim(),
      done: false,
      waktu: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      prioritas: getPrioritas()
    };

    setTasks([dataBaru, ...tasks]);
    setTask('');
  };

  // HAPUS TASK
  const hapusTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // TOGGLE SELESAI
  const toggleSelesai = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  // HAPUS SEMUA
  const hapusSemua = () => {
    if (tasks.length === 0) return;
    setTasks([]);
  };

  // PRIORITAS RANDOM
  const getPrioritas = () => {
    const list = ['Tinggi', 'Sedang', 'Rendah'];
    return list[Math.floor(Math.random() * 3)];
  };

  // WARNA PRIORITAS
  const warnaPrioritas = (p) => {
    if (p === 'Tinggi') return '#ef4444';
    if (p === 'Sedang') return '#facc15';
    return '#22c55e';
  };

  // FILTER DATA
  const dataFilter = tasks.filter(t => {
    if (filter === 'selesai') return t.done;
    if (filter === 'aktif') return !t.done;
    return true;
  });

  const jumlahSelesai = tasks.filter(t => t.done).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>📋 MyTaskList</Text>

            {tasks.length > 0 && (
              <TouchableOpacity onPress={hapusSemua}>
                <Text style={styles.clear}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.subtitle}>
            {jumlahSelesai} selesai dari {tasks.length} tugas
          </Text>
        </View>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocus
            ]}
            placeholder="Tulis tugas kamu..."
            placeholderTextColor="#888"
            value={task}
            onChangeText={setTask}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={100}
          />

          <TouchableOpacity style={styles.addBtn} onPress={tambahTask}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* COUNTER KARAKTER */}
        {task.length > 0 && (
          <Text style={styles.counter}>
            {task.length}/100 karakter
          </Text>
        )}

        {/* FILTER */}
        <View style={styles.filterRow}>
          {['semua', 'aktif', 'selesai'].map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterBtn,
                filter === item && styles.filterActive
              ]}
            >
              <Text style={styles.filterText}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        <FlatList
          data={dataFilter}
          keyExtractor={(item) => item.id.toString()}

          renderItem={({ item }) => (
            <View style={styles.card}>

              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => toggleSelesai(item.id)}
              >
                <Text style={[
                  styles.taskText,
                  item.done && styles.doneText
                ]}>
                  {item.text}
                </Text>

                <Text style={[
                  styles.meta,
                  { color: warnaPrioritas(item.prioritas) }
                ]}>
                  ⏱ {item.waktu} | {item.prioritas}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => hapusTask(item.id)}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>

            </View>
          )}

          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Belum ada tugas 😴</Text>
              <Text style={styles.emptySub}>Tambahkan sekarang!</Text>
            </View>
          }

          contentContainerStyle={styles.listContent}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1 },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: {
    color: '#38bdf8',
    fontSize: 26,
    fontWeight: 'bold'
  },

  clear: {
    color: '#ef4444',
    fontSize: 12
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: 4
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10
  },

  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },

  inputFocus: {
    borderColor: '#38bdf8'
  },

  addBtn: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 10
  },

  addText: {
    color: 'white',
    fontSize: 18
  },

  counter: {
    color: '#94a3b8',
    textAlign: 'right',
    marginRight: 16
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10
  },

  filterBtn: {
    backgroundColor: '#1e293b',
    padding: 6,
    borderRadius: 6
  },

  filterActive: {
    backgroundColor: '#38bdf8'
  },

  filterText: {
    color: 'white',
    fontSize: 12
  },

  listContent: {
    flexGrow: 1
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'space-between'
  },

  cardContent: {
    flex: 1
  },

  taskText: {
    color: 'white',
    fontSize: 16
  },

  doneText: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },

  meta: {
    fontSize: 12,
    marginTop: 4
  },

  delete: {
    fontSize: 18
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyText: {
    color: '#94a3b8',
    fontSize: 18
  },

  emptySub: {
    color: '#64748b',
    fontSize: 14
  }
});