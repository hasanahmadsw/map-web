import { Twitter, Linkedin, Globe, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/types/staff.types";

interface Author {

  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface AuthorProps {
  author: Author & Staff;
  className?: string;
}

export function Author({ author, className }: AuthorProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDefaultAvatar = () => {
    if (author.name) {
      return getInitials(author.name);
    }
    return <User className="h-6 w-6" />;
  };

  return (
    <div className={`flex items-center space-x-4 p-6 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/50 shadow-sm ${className || ""}`}>
      {/* Author Avatar */}
      <Avatar className="h-16 w-16 ring-2 ring-primary/20">
        <AvatarImage src={author.image || undefined} alt={author.name || "Author"} />
        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          {getDefaultAvatar()}
        </AvatarFallback>
      </Avatar>

      {/* Author Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground">{author.name || "Unknown Author"}</h3>
        
        </div>

        {author.bio && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{author.bio}</p>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {author.twitter && (
            <a
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
