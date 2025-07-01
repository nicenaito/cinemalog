-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movies table
CREATE TABLE public.movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  director TEXT,
  release_year INTEGER,
  genre TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create places table
CREATE TABLE public.places (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  place_type TEXT, -- 'theater', 'home', 'streaming', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create records table (main movie watching records)
CREATE TABLE public.records (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  place_id INTEGER REFERENCES public.places(id) ON DELETE SET NULL,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL,
  memo TEXT CHECK (char_length(memo) <= 5000),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create friends table
CREATE TABLE public.friends (
  id SERIAL PRIMARY KEY,
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  requested_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, requested_id),
  CHECK (requester_id != requested_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id SERIAL PRIMARY KEY,
  record_id INTEGER REFERENCES public.records(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_records_user_id ON public.records(user_id);
CREATE INDEX idx_records_watched_at ON public.records(watched_at);
CREATE INDEX idx_friends_requester_id ON public.friends(requester_id);
CREATE INDEX idx_friends_requested_id ON public.friends(requested_id);
CREATE INDEX idx_comments_record_id ON public.comments(record_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON public.records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
