-- Sample reference data — replace with the fraternity's real national structure.

insert into regions (name, code) values
  ('National Capital Region', 'NCR'),
  ('Cordillera Administrative Region', 'CAR'),
  ('Region I - Ilocos Region', 'R1'),
  ('Region II - Cagayan Valley', 'R2'),
  ('Region III - Central Luzon', 'R3'),
  ('Region IV-A - CALABARZON', 'R4A'),
  ('MIMAROPA Region', 'MIMAROPA'),
  ('Region V - Bicol Region', 'R5'),
  ('Region VI - Western Visayas', 'R6'),
  ('Region VII - Central Visayas', 'R7'),
  ('Region VIII - Eastern Visayas', 'R8'),
  ('Region IX - Zamboanga Peninsula', 'R9'),
  ('Region X - Northern Mindanao', 'R10'),
  ('Region XI - Davao Region', 'R11'),
  ('Region XII - SOCCSKSARGEN', 'R12'),
  ('Region XIII - Caraga', 'R13'),
  ('Bangsamoro Autonomous Region in Muslim Mindanao', 'BARMM')
on conflict (code) do nothing;


insert into positions (title, scope) values
  ('Grand Master', 'national'),
  ('Deputy Grand Master', 'national'),
  ('Secretary General', 'national'),
  ('Treasurer General', 'national'),
  ('Regional Governor', 'regional'),
  ('Chapter President', 'chapter'),
  ('Chapter Vice President', 'chapter'),
  ('Chapter Secretary', 'chapter'),
  ('Chapter Treasurer', 'chapter'),
  ('Sergeant-at-Arms', 'chapter')
on conflict (title) do nothing;
