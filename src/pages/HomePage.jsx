import React, { useState } from 'react';
import {
  ArrowRight, Cpu, Layers, Database, ExternalLink,
  Network, Box, MessageSquare, Terminal as TerminalIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Section,
  Container,
  Grid,
  Stack,
  Display,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  IconBox,
  Terminal
} from '../components/primitives/SystemicEngine';

export default function HomePage() {
  const [logs] = useState(['KERNEL_LOADED', 'LOGIC_ENGINE_READY', 'A_PHANTASIA_INIT']);

  return (
    <Stack gap={0}>
      <Helmet>
        <title>Ihor Solomianyi | Systemic Architect</title>
        <meta name="description" content="Architecting systems through pure logic. Senior AI & Systemic Engineer documenting the intersection of architecture and logic." />
      </Helmet>

      {/* ── HERO SCHEMA ── */}
      <Section py="12">
        <Container>
          <Grid lg="hero" gap={16} items="center">
            <Stack gap={10}>
              <Badge>Environment: Production</Badge>
              <Stack gap={0}>
                <Display>Architecting</Display>
                <Display accent>Systems</Display>
                <Display outline>Through Logic.</Display>
              </Stack>
              <Text size="lg" muted maxWidth>
                I translate chaos into deterministic structures. My approach is rooted in pure logic, aphantasic modeling, and systemic pragmatism.
              </Text>
              <Stack vertical={false} gap={4} wrap>
                <Button label="route(post.index)" icon={ArrowRight} as={Link} to="/blog" />
                <Button
                  label="NP42 Project"
                  variant="outline"
                  icon={ExternalLink}
                  as="a"
                  href="https://np42.dev"
                  target="_blank"
                  title="get known your 42 | Neuro Profile"
                  hoverLabel="get known your 42"
                />
              </Stack>
            </Stack>

            <Stack gap={6} fullWidth>
              <Terminal logs={logs} />
              <Grid cols={2} gap={4} md={2} lg={2}>
                <Card
                  padding="6"
                  interactive
                  as="a"
                  href="https://np42.dev"
                  target="_blank"
                  title="get known your 42 | Neuro Profile"
                >
                  <Stack align="center" gap={1}>
                    <Heading level={3}>42</Heading>
                    <Text mono muted>Nodes</Text>
                  </Stack>
                </Card>
                <Card padding="6">
                  <Stack align="center" gap={1}>
                    <Heading level={3}>1ms</Heading>
                    <Text mono muted>Latency</Text>
                  </Stack>
                </Card>
              </Grid>
            </Stack>
          </Grid>
        </Container>
      </Section>

      {/* ── REGISTRY SCHEMA ── */}
      <Section border bg="bg-white/[0.02]">
        <Container>
          <Stack gap={12}>
            <Stack gap={2}>
              <Heading level={2}>Registry of Logic</Heading>
              <Text mono muted>Systemic Deep-Dives & Architectures</Text>
            </Stack>

            <Grid cols={1} md={2} lg={3} gap={6}>
              <Card interactive>
                <Stack gap={6}>
                  <IconBox icon={Cpu} color="red" />
                  <Heading level={3}>LLM Orchestration</Heading>
                  <Text muted>Deterministic pipelines for agentic AI clusters.</Text>
                  <Text mono muted>Schema: Logic / Python</Text>
                </Stack>
              </Card>

              <Card interactive>
                <Stack gap={6}>
                  <IconBox icon={Layers} color="red" />
                  <Heading level={3}>Cloud Infra</Heading>
                  <Text muted>Scalable high-availability systems architecture.</Text>
                  <Text mono muted>Schema: K8s / AWS / Terraform</Text>
                </Stack>
              </Card>

              <Card interactive>
                <Stack gap={6}>
                  <IconBox icon={Database} color="red" />
                  <Heading level={3}>Core Backend</Heading>
                  <Text muted>Pure logic architectures without side effects.</Text>
                  <Text mono muted>Schema: Rust / Go / C++</Text>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* ── PHILOSOPHY SCHEMA ── */}
      <Section border>
        <Container>
          <Grid cols={1} md={2} gap={16} items="center">
            <Stack gap={8}>
              <Heading level={2}>The Engineering Engine</Heading>
              <Text size="lg" muted>
                My approach is dictated by my cognitive architecture. I build systems that are not just functional, but logically grounded and deterministic.
              </Text>
              <Stack gap={4}>
                <Stack vertical={false} align="center" gap={4}>
                  <IconBox icon={Network} color="white" />
                  <Text>Systemic Orchestration</Text>
                </Stack>
                <Stack vertical={false} align="center" gap={4}>
                  <IconBox icon={Box} color="white" />
                  <Text>Zero-Visual Modeling</Text>
                </Stack>
              </Stack>
            </Stack>

            <Card interactive>
              <Stack gap={4}>
                <TerminalIcon size={48} className="text-red-600 mb-4" />
                <Heading level={3}>Logic Driven</Heading>
                <Text muted>Every line of code is a mathematical argument in a systemic dialogue.</Text>
                <Button label="route(thesis.view)" variant="outline" size="sm" />
              </Stack>
            </Card>
          </Grid>
        </Container>
      </Section>

      <Section border py="32">
        <Container>
          <Card interactive padding="12">
            <Stack gap={8} align="center">
              <Heading level={2}>Let's talk systemic architecture.</Heading>
              <Text size="lg" muted weight="medium" align="center" maxWidth>
                Ready to design scalable LLM pipelines or optimize high-load distributed infrastructure?
              </Text>
              <Stack vertical={false} gap={4}>
                <Button label="route(contact.init)" as="a" href="mailto:ingvar.soloma@gmail.com" />
                <Button label="LinkedIn" variant="outline" as="a" href="https://linkedin.com" />
              </Stack>
            </Stack>
          </Card>
        </Container>
      </Section>
    </Stack>
  );
}
