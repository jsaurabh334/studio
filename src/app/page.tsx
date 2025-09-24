import { redirect } from 'next/navigation';

// For this application, we are redirecting to the login page
// as the default entry point.
export default function Home() {
  redirect('/login');
}
