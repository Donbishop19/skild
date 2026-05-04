import { usePostHog } from "@posthog/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import { dummySkills } from "#/lib/dummy-skills";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const posthog = usePostHog();

	const handleBrowseRegistryClick = () => {
		posthog.capture("browse_registry_clicked");
	};

	const handlePublishSkillClick = () => {
		posthog.capture("publish_skill_clicked");
	};

	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						The Registry <br />
						<span className="text-gradient">Agentic Intelligence</span>
					</h1>
					<p>
						A high-performance registry for procedural agent skills. Discover,
						publish, and operate reusable agent capabilities from a route-driven
						workspace.
					</p>
				</div>
				<div className="actions">
					<Link
						to="/skills"
						className="btn-primary"
						onClick={handleBrowseRegistryClick}
					>
						<Terminal size={18} />
						<span>Browse Registry</span>
					</Link>
					<Link
						to="/skills/new"
						className="btn-secondary"
						onClick={handlePublishSkillClick}
					>
						<Terminal size={18} />
						Publish Skill
					</Link>
				</div>
			</section>

			<section className="latest">
				<div className="space-y-2">
					<h2>
						Recently Created <span className="text-gradient">Skills</span>{" "}
            
					</h2>
					<p>
						Latest skills loaded from Firestore in descending creation order.
					</p>
				</div>
				<div>
					{dummySkills.length > 0 ? (
						<div className="skills-grid">
							{dummySkills.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					) : (
						<p>No skills have been created yet.</p>
					)}
				</div>
			</section>
		</div>
	);
}
