
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface CourseProps {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  price: number;
  image: string;
  category: string;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  level,
  price,
  image,
  category,
}: CourseProps) => {
  const levelColorMap = {
    Principiante: "bg-green-100 text-green-800",
    Intermedio: "bg-blue-100 text-blue-800",
    Avanzado: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          <Badge 
            variant="secondary" 
            className={levelColorMap[level]}
          >
            {level}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Instructor: {instructor}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">
          {price === 0 ? "Gratis" : `$${price.toFixed(2)}`}
        </div>
        <Button asChild>
          <Link to="#login">Inscribirse</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
