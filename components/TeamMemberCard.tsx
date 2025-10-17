import { Card, CardContent } from '@/components/ui/card';
import { TeamMember } from '@/types';
import LazyImage from '@/components/LazyImage';
import { memo } from 'react';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = memo<TeamMemberCardProps>(({ member }) => {
  return (
    <Card className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
          <div className="w-full h-full relative">
            <LazyImage
              src={member.image}
              alt={member.name}
              fill
              className="object-cover w-full h-full"
              sizes="128px"
              quality={75}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{member.description}</p>
      </CardContent>
    </Card>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';

export default TeamMemberCard;