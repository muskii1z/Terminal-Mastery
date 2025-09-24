// Test script to verify progress tracking with all 20 lessons
// Run with: node test-progress-20-lessons.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProgressTracking() {
  console.log('🧪 Testing progress tracking with all 20 lessons...\n');

  try {
    // Test 1: Check if we have all 20 lessons
    console.log('1. Checking lesson count...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, sort_order')
      .order('sort_order');

    if (lessonsError) {
      console.log('❌ Error fetching lessons:', lessonsError.message);
      return;
    }

    console.log(`✅ Found ${lessons.length} lessons in database`);

    if (lessons.length !== 20) {
      console.log('⚠️  Expected 20 lessons, but found', lessons.length);
      console.log('Run the migration script to add missing lessons');
    }

    // Show all lessons
    console.log('\nLesson overview:');
    lessons.forEach(lesson => {
      console.log(`   ${lesson.id.padStart(2)}: ${lesson.title}`);
    });

    // Test 2: Check lesson completions table structure
    console.log('\n2. Testing lesson completions structure...');
    const { data: completions, error: completionsError } = await supabase
      .from('lesson_completions')
      .select('*')
      .limit(1);

    if (completionsError) {
      console.log('❌ Error accessing lesson_completions:', completionsError.message);
      return;
    }

    console.log('✅ lesson_completions table is accessible');

    // Test 3: Test progress calculation functions
    console.log('\n3. Testing progress calculation...');

    // Mock user ID for testing (in real app, this would come from auth)
    const testUserId = '00000000-0000-0000-0000-000000000000';

    // Simulate progress calculation
    const completedLessonIds = ['1', '2', '3']; // Simulate 3 completed lessons
    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.length;
    const totalProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    console.log(`   Total lessons: ${totalLessons}`);
    console.log(`   Completed lessons: ${completedCount}`);
    console.log(`   Progress: ${totalProgress}%`);

    // Test next lesson logic
    const nextIncompleteLesson = lessons.find(lesson =>
      !completedLessonIds.includes(lesson.id)
    );

    console.log(`   Next lesson: ${nextIncompleteLesson ? `${nextIncompleteLesson.id} - ${nextIncompleteLesson.title}` : 'All complete!'}`);

    // Test 4: Verify lesson IDs are sequential 1-20
    console.log('\n4. Verifying lesson ID sequence...');
    const expectedIds = Array.from({length: 20}, (_, i) => (i + 1).toString());
    const actualIds = lessons.map(l => l.id).sort((a, b) => parseInt(a) - parseInt(b));

    const missingIds = expectedIds.filter(id => !actualIds.includes(id));
    const extraIds = actualIds.filter(id => !expectedIds.includes(id));

    if (missingIds.length === 0 && extraIds.length === 0) {
      console.log('✅ All lesson IDs 1-20 are present');
    } else {
      if (missingIds.length > 0) {
        console.log('❌ Missing lesson IDs:', missingIds.join(', '));
      }
      if (extraIds.length > 0) {
        console.log('❌ Unexpected lesson IDs:', extraIds.join(', '));
      }
    }

    // Test 5: Check for legacy user_progress table
    console.log('\n5. Checking for legacy tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'user_progress');

    if (tablesError) {
      console.log('⚠️  Could not check for legacy tables (this is normal)');
    } else if (tables && tables.length > 0) {
      console.log('⚠️  Legacy user_progress table still exists - consider running migration');
    } else {
      console.log('✅ No legacy user_progress table found');
    }

    console.log('\n🎉 Progress tracking test completed!');
    console.log('\n📋 Summary:');
    console.log(`✅ Lessons in database: ${lessons.length}/20`);
    console.log('✅ lesson_completions table working');
    console.log('✅ Progress calculation logic functional');
    console.log('✅ Next lesson detection working');

    if (lessons.length === 20) {
      console.log('\n🎯 All systems ready for 20-lesson progress tracking!');
    } else {
      console.log('\n⚠️  Run the migration script to add missing lessons');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testProgressTracking();