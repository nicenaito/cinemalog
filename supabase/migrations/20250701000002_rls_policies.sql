-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Movies and places are public readable, admin writable
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data and other users' basic info
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view other users' basic info" ON public.users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Auto-insert user on signup
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Records table policies
-- Users can CRUD their own records
CREATE POLICY "Users can view own records" ON public.records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON public.records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON public.records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON public.records
  FOR DELETE USING (auth.uid() = user_id);

-- Users can view friends' records
CREATE POLICY "Users can view friends records" ON public.records
  FOR SELECT USING (
    user_id IN (
      SELECT requester_id FROM public.friends 
      WHERE requested_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT requested_id FROM public.friends 
      WHERE requester_id = auth.uid() AND status = 'accepted'
    )
  );

-- Friends table policies
-- Users can view their friend requests and relationships
CREATE POLICY "Users can view own friend requests" ON public.friends
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = requested_id
  );

-- Users can create friend requests
CREATE POLICY "Users can send friend requests" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Users can update friend requests they received
CREATE POLICY "Users can respond to friend requests" ON public.friends
  FOR UPDATE USING (auth.uid() = requested_id);

-- Users can delete their own friend requests
CREATE POLICY "Users can delete own friend requests" ON public.friends
  FOR DELETE USING (auth.uid() = requester_id);

-- Comments table policies
-- Users can view comments on records they can see
CREATE POLICY "Users can view comments on accessible records" ON public.comments
  FOR SELECT USING (
    record_id IN (
      SELECT id FROM public.records 
      WHERE user_id = auth.uid()
      OR user_id IN (
        SELECT requester_id FROM public.friends 
        WHERE requested_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT requested_id FROM public.friends 
        WHERE requester_id = auth.uid() AND status = 'accepted'
      )
    )
  );

-- Users can insert comments on friends' records
CREATE POLICY "Users can comment on friends records" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND record_id IN (
      SELECT id FROM public.records 
      WHERE user_id IN (
        SELECT requester_id FROM public.friends 
        WHERE requested_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT requested_id FROM public.friends 
        WHERE requester_id = auth.uid() AND status = 'accepted'
      )
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Movies and Places policies (public read)
CREATE POLICY "Movies are publicly readable" ON public.movies
  FOR SELECT USING (true);

CREATE POLICY "Places are publicly readable" ON public.places
  FOR SELECT USING (true);

-- Only authenticated users can insert movies and places (for now)
CREATE POLICY "Authenticated users can add movies" ON public.movies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can add places" ON public.places
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
