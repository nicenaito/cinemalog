-- Insert some sample movies
INSERT INTO public.movies (title, director, release_year, genre) VALUES
('君の名は。', '新海誠', 2016, 'アニメ'),
('千と千尋の神隠し', '宮崎駿', 2001, 'アニメ'),
('羅生門', '黒澤明', 1950, 'ドラマ'),
('七人の侍', '黒澤明', 1954, 'アクション'),
('トイ・ストーリー', 'ジョン・ラセター', 1995, 'アニメ'),
('タイタニック', 'ジェームズ・キャメロン', 1997, 'ロマンス'),
('インセプション', 'クリストファー・ノーラン', 2010, 'SF'),
('アベンジャーズ', 'ジョス・ウェドン', 2012, 'アクション'),
('となりのトトロ', '宮崎駿', 1988, 'アニメ'),
('スター・ウォーズ エピソード4/新たなる希望', 'ジョージ・ルーカス', 1977, 'SF');

-- Insert some sample places
INSERT INTO public.places (name, address, place_type) VALUES
('TOHOシネマズ新宿', '東京都新宿区歌舞伎町1-19-1', 'theater'),
('自宅', NULL, 'home'),
('Netflix', NULL, 'streaming'),
('Amazon Prime Video', NULL, 'streaming'),
('TOHO シネマズ渋谷', '東京都渋谷区道玄坂2-6-17', 'theater'),
('ユナイテッド・シネマ豊洲', '東京都江東区豊洲2-4-9', 'theater'),
('Hulu', NULL, 'streaming'),
('Disney+', NULL, 'streaming'),
('U-NEXT', NULL, 'streaming'),
('イオンシネマ', '全国各地', 'theater');
